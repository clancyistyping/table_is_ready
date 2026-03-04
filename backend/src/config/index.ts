import "dotenv/config";
function requireEnv(name: string) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export const config = {
    jwtSecret: requireEnv("JWT_SECRET"),
    nodeEnv: process.env.NODE_ENV ?? "development",
};