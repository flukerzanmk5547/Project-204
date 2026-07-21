import { BaseService } from "../../shared/BaseService.js";
import { HttpException } from "../../shared/HttpException.js";
import { Database } from "../../config/Database.js";
import { CategoryRepository } from "./CategoryRepository.js";
import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "./CategorySchema.js";

interface CategoryTree extends Category {
  children: CategoryTree[];
}

interface BreadcrumbItem {
  name: string;
  slug: string;
  route_path: string;
}

interface CategoryFullData {
  category: Category;
  breadcrumb: BreadcrumbItem[];
  children: Category[];
  products: unknown[];
}

export class CategoryService extends BaseService<Category> {
  private readonly categoryRepo: CategoryRepository;

  constructor() {
    const repo = new CategoryRepository();
    super(repo);
    this.categoryRepo = repo;
  }

  public async getCategoryTree(): Promise<CategoryTree[]> {
    const allCategories = await this.categoryRepo.findWithChildren();
    return this.buildTree(allCategories);
  }

  public async getRootCategories(): Promise<Category[]> {
    return this.categoryRepo.findRootCategories();
  }

  public async getChildren(parentId: string): Promise<Category[]> {
    return this.categoryRepo.findChildren(parentId);
  }

  public async getByRoutePath(routePath: string): Promise<CategoryFullData> {
    const category = await this.categoryRepo.findByRoutePath(routePath);
    if (!category) {
      throw HttpException.notFound(`ไม่พบหมวดหมู่: ${routePath}`);
    }

    const [ancestors, children] = await Promise.all([
      this.categoryRepo.findAncestors(category),
      this.categoryRepo.findChildren(category.id),
    ]);

    const products = await this.getCategoryProducts(category);

    const breadcrumb: BreadcrumbItem[] = [
      ...ancestors.map((a) => ({
        name: a.name,
        slug: a.slug,
        route_path: a.route_path,
      })),
      {
        name: category.name,
        slug: category.slug,
        route_path: category.route_path,
      },
    ];

    return { category, breadcrumb, children, products };
  }

  private async getCategoryProducts(category: Category): Promise<unknown[]> {
    const db = Database.getInstance().getAdminClient();

    // รวมสินค้าของหมวดนี้ + หมวดย่อยทั้งหมด (subtree)
    const ids = await this.getAllDescendantIds(category.id);
    ids.push(category.id);

    const { data } = await db
      .from("products")
      .select("*")
      .in("category_id", ids)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(60);

    const products = data ?? [];

    // ถ้าหมวดนี้ (และหมวดย่อย) ไม่มีสินค้า ให้ดึงจากหมวดแม่ขึ้นไปแทน
    // กันไม่ให้หน้า leaf ที่ไม่มีสินค้าตรงๆ ขึ้นว่าง
    if (products.length === 0 && category.parent_id) {
      const parent = await this.categoryRepo.findById(category.parent_id);
      if (parent) return this.getCategoryProducts(parent);
    }

    return products;
  }

  private async getAllDescendantIds(parentId: string): Promise<string[]> {
    const children = await this.categoryRepo.findChildren(parentId);
    const ids: string[] = [];

    for (const child of children) {
      ids.push(child.id);
      const descendants = await this.getAllDescendantIds(child.id);
      ids.push(...descendants);
    }

    return ids;
  }

  public async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.categoryRepo.findBySlug(dto.slug);
    if (existing) {
      throw HttpException.conflict(`Slug "${dto.slug}" มีอยู่ในระบบแล้ว`);
    }
    return this.create(dto as Partial<Category>);
  }

  public async updateCategory(
    id: string,
    dto: UpdateCategoryDto
  ): Promise<Category> {
    if (dto.slug) {
      const existing = await this.categoryRepo.findBySlug(dto.slug);
      if (existing && existing.id !== id) {
        throw HttpException.conflict(`Slug "${dto.slug}" ถูกใช้งานแล้ว`);
      }
    }
    return this.update(id, dto as Partial<Category>);
  }

  public async deleteCategory(id: string): Promise<void> {
    const children = await this.categoryRepo.findChildren(id);
    if (children.length > 0) {
      throw HttpException.badRequest(
        "ไม่สามารถลบหมวดหมู่ที่มีหมวดหมู่ย่อยได้"
      );
    }
    return this.remove(id);
  }

  private buildTree(categories: Category[]): CategoryTree[] {
    const map = new Map<string, CategoryTree>();
    const roots: CategoryTree[] = [];

    for (const cat of categories) {
      map.set(cat.id, { ...cat, children: [] });
    }

    for (const cat of categories) {
      const node = map.get(cat.id)!;
      if (cat.parent_id && map.has(cat.parent_id)) {
        map.get(cat.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }
}
