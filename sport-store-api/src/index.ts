import { Application } from "./Application.js";

async function main(): Promise<void> {
  const app = new Application();

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    await app.stop();
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  await app.start();
}

main().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
