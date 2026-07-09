import { HttpException } from "../../shared/HttpException.js";
import { BundleRepository } from "./BundleRepository.js";
import type {
  CreateBundleDto,
  UpdateBundleDto,
  BundleWithItems,
  ProductBundle,
} from "./BundleSchema.js";

export class BundleService {
  private readonly repository: BundleRepository;

  constructor() {
    this.repository = new BundleRepository();
  }

  /**
   * ดึง bundle ทั้งหมด (admin)
   */
  public async getAll(): Promise<ProductBundle[]> {
    const result = await this.repository.findAll();
    return result.data;
  }

  /**
   * ดึง bundle พร้อมสินค้า + คำนวณราคา
   */
  public async getById(id: string): Promise<BundleWithItems> {
    const bundle = await this.repository.findById(id);
    if (!bundle) throw HttpException.notFound("ไม่พบ bundle นี้");
    return this.enrichBundle(bundle);
  }

  /**
   * ดึง bundles ที่ active (สำหรับหน้าเว็บ)
   */
  public async getActiveBundles(): Promise<BundleWithItems[]> {
    const bundles = await this.repository.findActiveBundles();
    return Promise.all(bundles.map((b) => this.enrichBundle(b)));
  }

  /**
   * ดึง bundles ที่เชื่อมกับ product (แสดงในหน้า product detail "ซื้อเป็นเซ็ต")
   */
  public async getBundlesForProduct(productId: string): Promise<BundleWithItems[]> {
    const bundles = await this.repository.getBundlesForProduct(productId);
    const activeBundles = bundles.filter((b) => b.is_active);
    return Promise.all(activeBundles.map((b) => this.enrichBundle(b)));
  }

  /**
   * สร้าง bundle ใหม่
   */
  public async create(dto: CreateBundleDto): Promise<ProductBundle> {
    const existing = await this.repository.findBySlug(dto.slug);
    if (existing) throw HttpException.conflict("Slug นี้ถูกใช้แล้ว");
    return this.repository.create(dto);
  }

  /**
   * อัพเดท bundle
   */
  public async update(id: string, dto: UpdateBundleDto): Promise<ProductBundle> {
    const bundle = await this.repository.findById(id);
    if (!bundle) throw HttpException.notFound("ไม่พบ bundle นี้");

    if (dto.slug && dto.slug !== bundle.slug) {
      const existing = await this.repository.findBySlug(dto.slug);
      if (existing) throw HttpException.conflict("Slug นี้ถูกใช้แล้ว");
    }

    return this.repository.update(id, dto);
  }

  /**
   * ลบ bundle
   */
  public async remove(id: string): Promise<void> {
    const bundle = await this.repository.findById(id);
    if (!bundle) throw HttpException.notFound("ไม่พบ bundle นี้");
    await this.repository.delete(id);
  }

  // --- Bundle Items ---

  public async addItem(
    bundleId: string,
    productId: string,
    quantity: number,
    sortOrder: number
  ): Promise<void> {
    const bundle = await this.repository.findById(bundleId);
    if (!bundle) throw HttpException.notFound("ไม่พบ bundle นี้");

    await this.repository.addBundleItem(bundleId, productId, quantity, sortOrder);
  }

  public async addItems(
    bundleId: string,
    items: { product_id: string; quantity: number; sort_order: number }[]
  ): Promise<void> {
    const bundle = await this.repository.findById(bundleId);
    if (!bundle) throw HttpException.notFound("ไม่พบ bundle นี้");

    for (const item of items) {
      await this.repository.addBundleItem(
        bundleId,
        item.product_id,
        item.quantity,
        item.sort_order
      );
    }
  }

  public async removeItem(bundleId: string, itemId: string): Promise<void> {
    await this.repository.removeBundleItem(itemId);
  }

  // --- Product-Bundle Links ---

  public async linkToProduct(
    productId: string,
    bundleId: string,
    sortOrder: number
  ): Promise<void> {
    await this.repository.linkBundleToProduct(productId, bundleId, sortOrder);
  }

  public async unlinkFromProduct(
    productId: string,
    bundleId: string
  ): Promise<void> {
    await this.repository.unlinkBundleFromProduct(productId, bundleId);
  }

  // --- Private ---

  private async enrichBundle(bundle: ProductBundle): Promise<BundleWithItems> {
    const items = await this.repository.getBundleItems(bundle.id);

    let totalOriginal = 0;
    for (const item of items) {
      totalOriginal += item.product.price * item.quantity;
    }

    let totalBundle: number;

    switch (bundle.discount_type) {
      case "percentage":
        totalBundle = totalOriginal * (1 - bundle.discount_value / 100);
        break;
      case "fixed_amount":
        totalBundle = Math.max(0, totalOriginal - bundle.discount_value);
        break;
      case "fixed_price":
        totalBundle = bundle.discount_value;
        break;
      default:
        totalBundle = totalOriginal;
    }

    totalBundle = Math.round(totalBundle * 100) / 100;

    return {
      ...bundle,
      items,
      total_original_price: totalOriginal,
      total_bundle_price: totalBundle,
      savings: Math.round((totalOriginal - totalBundle) * 100) / 100,
    };
  }
}
