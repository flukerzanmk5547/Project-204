import { z } from "zod";

export class AddressSchema {
  public static readonly create = z.object({
    label: z.string().nullish(),
    full_name: z.string().min(1, "กรุณาระบุชื่อ-นามสกุล"),
    phone: z.string().min(9, "กรุณาระบุเบอร์โทรศัพท์"),
    postal_code: z.string().length(5, "รหัสไปรษณีย์ต้อง 5 หลัก"),
    province: z.string().min(1, "กรุณาระบุจังหวัด"),
    amphoe: z.string().min(1, "กรุณาระบุเขต/อำเภอ"),
    district: z.string().nullish(),
    address: z.string().min(1, "กรุณาระบุที่อยู่"),
    note: z.string().nullish(),
    is_default: z.boolean().optional(),
  });

  public static readonly update = AddressSchema.create.partial();
}

export interface AddressEntity {
  id: string;
  user_id: string;
  label: string | null;
  full_name: string;
  phone: string;
  postal_code: string;
  province: string;
  amphoe: string;
  district: string | null;
  address: string;
  note: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateAddressDto = z.infer<typeof AddressSchema.create>;
export type UpdateAddressDto = z.infer<typeof AddressSchema.update>;
