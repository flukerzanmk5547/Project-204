import type { FastifyInstance } from "fastify";
import { AddressController } from "./AddressController.js";
import { AuthPlugin } from "../../plugins/AuthPlugin.js";

export class AddressRoutes {
  private readonly controller: AddressController;

  constructor() {
    this.controller = new AddressController();
  }

  public register(app: FastifyInstance): void {
    app.register(
      async (router) => {
        router.addHook("preHandler", AuthPlugin.authenticate);

        router.get("/", this.controller.getAll.bind(this.controller));
        router.get("/:id", this.controller.getById.bind(this.controller));
        router.post("/", this.controller.create.bind(this.controller));
        router.put("/:id", this.controller.update.bind(this.controller));
        router.delete("/:id", this.controller.remove.bind(this.controller));
      },
      { prefix: "/api/v1/addresses" }
    );
  }
}
