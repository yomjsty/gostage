export type ApiResponse = {
    status: "success" | "error";
    message: string;
    token?: string;
}