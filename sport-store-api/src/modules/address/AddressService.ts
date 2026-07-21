import { HttpException } from "../../shared/HttpException.js";
import { AddressRepository } from "./AddressRepository.js";
import type {
  AddressEntity,
  CreateAddressDto,
  UpdateAddressDto,
} from "./AddressSchema.js";

export class AddressService {
  private readonly repository: AddressRepository;

  constructor() {
    this.repository = new AddressRepository();
  }

  public async getAll(userId: string): Promise<AddressEntity[]> {
    return this.repository.findByUserId(userId);
  }

  public async getById(
    userId: string,
    addressId: string
  ): Promise<AddressEntity> {
    const addr = await this.repository.findById(addressId);
    if (!addr || addr.user_id !== userId) {
      throw HttpException.notFound("ไม่พบที่อยู่");
    }
    return addr;
  }

  public async create(
    userId: string,
    dto: CreateAddressDto
  ): Promise<AddressEntity> {
    if (dto.is_default) {
      await this.repository.clearDefault(userId);
    }

    const existing = await this.repository.findByUserId(userId);
    const isFirst = existing.length === 0;

    return this.repository.create({
      ...dto,
      user_id: userId,
      is_default: dto.is_default || isFirst,
    } as Partial<AddressEntity>);
  }

  public async update(
    userId: string,
    addressId: string,
    dto: UpdateAddressDto
  ): Promise<AddressEntity> {
    await this.getById(userId, addressId);

    if (dto.is_default) {
      await this.repository.clearDefault(userId);
    }

    return this.repository.update(addressId, dto as Partial<AddressEntity>);
  }

  public async remove(userId: string, addressId: string): Promise<void> {
    await this.getById(userId, addressId);
    await this.repository.delete(addressId);
  }
}
