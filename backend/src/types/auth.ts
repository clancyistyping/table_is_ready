export interface JwtPayload {
    userId: string;
    role: "USER" | "ADMIN";
}