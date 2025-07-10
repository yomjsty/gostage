export function generateHostedQRCode(text: string): string {
    // Use QR Server API to generate hosted QR codes
    // This service generates QR codes as hosted images that work reliably in emails
    const encodedText = encodeURIComponent(text);
    const size = 200; // Size in pixels
    const margin = 2; // Margin around QR code

    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&margin=${margin}&format=png`;
} 