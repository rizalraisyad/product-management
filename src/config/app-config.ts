export interface AppConfig {
  hostname: string;
  port: number;
}

export function appConfig(): AppConfig {
  return {
    hostname: process.env.HOSTNAME || 'localhost',
    port: Number(process.env.PORT) || 3000,
  };
}
