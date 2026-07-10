import { BaseService } from "../../shared/BaseService.js";
import { BannerRepository } from "./BannerRepository.js";
import type { Banner, BannerQueryDto, CreateBannerDto, UpdateBannerDto } from "./BannerSchema.js";

export class BannerService extends BaseService<Banner> {
  private readonly bannerRepo: BannerRepository;

  constructor() {
    const repo = new BannerRepository();
    super(repo);
    this.bannerRepo = repo;
  }

  public async getBanners(query: BannerQueryDto): Promise<Banner[]> {
    return this.bannerRepo.findByQuery(query);
  }

  public async createBanner(dto: CreateBannerDto): Promise<Banner> {
    return this.create(dto as Partial<Banner>);
  }

  public async updateBanner(id: string, dto: UpdateBannerDto): Promise<Banner> {
    return this.update(id, dto as Partial<Banner>);
  }

  public async deleteBanner(id: string): Promise<void> {
    return this.remove(id);
  }
}
