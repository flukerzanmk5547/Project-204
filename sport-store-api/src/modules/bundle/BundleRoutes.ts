import type { FastifyInstance } from "fastify";
import { BundleController } from "./BundleController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class BundleRoutes {
  private readonly controller: BundleController;

  constructor() {
    this.controller = new BundleController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        // === Public ===
        // ดึง bundles ที่ active ทั้งหมด
        router.get(
          "/active",
          this.controller.getActiveBundles.bind(this.controller)
        );

        // ดึง bundles สำหรับหน้า product detail "ซื้อเป็นเซ็ต"
        router.get(
          "/product/:productId",
          this.controller.getBundlesForProduct.bind(this.controller)
        );

        // ดึง bundle by ID พร้อมสินค้า + ราคา
        router.get(
          "/:id",
          this.controller.getById.bind(this.controller)
        );

        // === Admin (ต้อง login) ===
        // ดึง bundles ทั้งหมด (รวม inactive)
        router.get(
          "/",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.getAll.bind(this.controller)
        );

        // สร้าง bundle ใหม่
        router.post(
          "/",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.create.bind(this.controller)
        );

        // อัพเดท bundle
        router.put(
          "/:id",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.update.bind(this.controller)
        );

        // ลบ bundle
        router.delete(
          "/:id",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.remove.bind(this.controller)
        );

        // --- Bundle Items ---
        // เพิ่มสินค้าเข้า bundle (ทีละชิ้น)
        router.post(
          "/:id/items",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.addItem.bind(this.controller)
        );

        // เพิ่มสินค้าเข้า bundle (หลายชิ้น)
        router.post(
          "/:id/items/batch",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.addItems.bind(this.controller)
        );

        // ลบสินค้าออกจาก bundle
        router.delete(
          "/:id/items/:itemId",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.removeItem.bind(this.controller)
        );

        // --- Product-Bundle Links ---
        // เชื่อม bundle → แสดงในหน้า product detail
        router.post(
          "/:id/link",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.linkToProduct.bind(this.controller)
        );

        // ยกเลิกเชื่อม
        router.delete(
          "/:id/link",
          { preHandler: [AuthPlugin.authenticate] },
          this.controller.unlinkFromProduct.bind(this.controller)
        );
      },
      { prefix: "/api/v1/bundles" }
    );
  }
}
