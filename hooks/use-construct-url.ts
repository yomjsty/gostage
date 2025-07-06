import { env } from "@/lib/env";

export function useConstructUrl(key: string): string {
    return `https://${env.NEXT_PUBLIC_UPLOADTHING_APP_ID}.ufs.sh/f/${key}`
}
