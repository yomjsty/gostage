import midtransClient from "midtrans-client";
import { env } from "./env";

export const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: env.MIDTRANS_SERVER_KEY
});