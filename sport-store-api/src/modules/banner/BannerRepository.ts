import { BaseRepository } from "../../shared/BaseRepository.js";
import type { Banner, BannerQueryDto } from "./BannerSchema.js";

export class BannerRepository extends BaseRepository<Banner> {
  constructor() {
    super("banners");
  }

  public async findByQuery(query: BannerQueryDto): Promise<Banner[]> {
    let dbQuery = this.table.select("*");

    if (query.type) dbQuery = dbQuery.eq("type", query.type);
    if (query.section_key) dbQuery = dbQuery.eq("section_key", query.section_key);
    if (query.is_active !== undefined) dbQuery = dbQuery.eq("is_active", query.is_active);

    dbQuery = dbQuery.order("sort_order", { ascending: true });

    const { data, error } = await dbQuery;
    if (error) throw new Error(`Failed to fetch banners: ${error.message}`);
    return (data as Banner[]) ?? [];
  }
}
