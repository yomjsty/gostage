import QRCode from "qrcode";

export async function generateQRCodeBase64(text: string): Promise<string> {
    const dataUrl = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
            dark: "#000000",
            light: "#ffffff",
        },
    });

    return dataUrl.replace(/^data:image\/png;base64,/, "");
}
