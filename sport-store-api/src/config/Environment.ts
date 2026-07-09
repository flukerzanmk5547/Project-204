import dotenv from "dotenv";

dotenv.config();

export class Environment {
  private static instance: Environment;
  private readonly env: Record<string, string>;

  private constructor() {
    this.env = {
      PORT: process.env.PORT ?? "4000",
      HOST: process.env.HOST ?? "0.0.0.0",
      NODE_ENV: process.env.NODE_ENV ?? "development",
      SUPABASE_URL: process.env.SUPABASE_URL ?? "",
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ?? "",
      CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    };
    this.validate();
  }

  public static getInstance(): Environment {
    if (!Environment.instance) {
      Environment.instance = new Environment();
    }
    return Environment.instance;
  }

  private validate(): void {
    const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];
    const missing = required.filter((key) => !this.env[key]);

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }

  public get port(): number {
    return parseInt(this.env.PORT, 10);
  }

  public get host(): string {
    return this.env.HOST;
  }

  public get nodeEnv(): string {
    return this.env.NODE_ENV;
  }

  public get isDevelopment(): boolean {
    return this.env.NODE_ENV === "development";
  }

  public get isProduction(): boolean {
    return this.env.NODE_ENV === "production";
  }

  public get supabaseUrl(): string {
    return this.env.SUPABASE_URL;
  }

  public get supabaseAnonKey(): string {
    return this.env.SUPABASE_ANON_KEY;
  }

  public get corsOrigin(): string {
    return this.env.CORS_ORIGIN;
  }
}
