"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription,
    CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { RotateCcw, Camera, Check, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { toast } from "sonner";
import { VerifyQRCodeTicketType } from "@/dal/organizer/verify-qr-code-ticket";

export default function QRScannerPage() {
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [scanning, setScanning] = useState(false);
    const [scannedText, setScannedText] = useState("");
    const [ticketData, setTicketData] = useState<VerifyQRCodeTicketType>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [ticketError, setTicketError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const startScan = async () => {
        if (scanning) return;

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        setScanning(true);
        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    setScannedText(decodedText);
                    html5QrCode.stop();
                    setScanning(false);
                },
                (error) => {
                    toast.error("Scan error" + error);
                    setScanning(false);
                }
            );
        } catch (err) {
            console.error("Scan error", err);
            setScanning(false);
        }
    };

    const resetScanner = () => {
        setTicketData(null);
        setVerified(false);
        setTicketError("");
        setScannedText("");
        setScanning(false);
    };

    useEffect(() => {
        return () => {
            if (scannerRef.current) scannerRef.current.stop().catch(() => { });
        };
    }, []);

    useEffect(() => {
        if (!scannedText) return;

        const fetchTicketData = async () => {
            setIsLoading(true);
            setTicketError("");
            try {
                const res = await fetch(`/api/tickets/verify?qr=${encodeURIComponent(scannedText)}`);
                if (!res.ok) {
                    const errorData = await res.json();

                    if (errorData.error === "Ticket has already been used") {
                        setTicketError("used");
                    } else if (errorData.error === "Ticket not found") {
                        setTicketError("notfound");
                    } else if (errorData.error === "User is not authorized") {
                        setTicketError("unauthorized");
                    } else {
                        setTicketError("other");
                    }
                    setTicketData(null);
                    return;
                }
                const data = await res.json();
                setTicketData(data);
            } catch (err) {
                console.error("Failed to fetch ticket:", err);
                setTicketData(null);
                setTicketError("other");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTicketData();
    }, [scannedText]);

    const handleVerify = async () => {
        if (!ticketData?.id) return;

        setIsVerifying(true);
        try {
            const res = await fetch("/api/tickets/verify", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticketId: ticketData.id }),
            });

            if (!res.ok) throw new Error("Failed to verify ticket");

            await res.json();
            toast.success("Ticket verified successfully!");
            setVerified(true);
            setTicketData(null);
            setScannedText("");
        } catch (err) {
            toast.error("Verification failed");
            console.error(err);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="space-y-4 max-w-5xl mx-auto py-20">
            <h1 className="text-xl font-bold">Scan QR Code</h1>
            <div className="grid md:grid-cols-10 gap-4">
                {/* SCANNER */}
                <div className="md:col-span-6">
                    <Card className="py-5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Camera className="size-5" /> QR Code Scanner
                            </CardTitle>
                            <CardDescription>
                                Point your QR Code to the camera to scan it
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div id="reader" className="aspect-video rounded shadow bg-gradient-to-br from-primary/10 to-background" />
                            <div className="flex items-center justify-center gap-2">
                                <Button onClick={startScan} disabled={scanning}>
                                    <Camera className="size-4" /> {scanning ? "Scanning..." : "Start Scanning"}
                                </Button>
                                <Button onClick={resetScanner} variant="outline">
                                    <RotateCcw className="size-4" /> Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RESULT */}
                <div className="md:col-span-4">
                    <Card className="py-5 md:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-xl">Attendee Details</CardTitle>
                            <CardDescription>Ticket & Attendee Details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {!scannedText ? (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <p className="text-sm text-muted-foreground">Scan a ticket to see the details</p>
                                </div>
                            ) : null}
                            {ticketData ? (
                                <>
                                    {ticketData.isUsed && (
                                        <p className="text-sm text-yellow-600 font-semibold mb-2">Ticket is already used</p>
                                    )}
                                    <div className="flex items-center gap-3 text-xs lg:text-sm font-medium tracking-wide">
                                        <div className="flex flex-col gap-1.5 shrink-0 w-fit">
                                            <p>Event:</p>
                                            <p>Order ID:</p>
                                            <p>Ticket ID:</p>
                                            <p>Ticket Category:</p>
                                            <p>Price:</p>
                                            <p>Status:</p>
                                            <p>Bought By:</p>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <p className="line-clamp-1">{ticketData.category.event.title}</p>
                                            <p className="line-clamp-1">{ticketData.reservation?.orderId}</p>
                                            <p className="line-clamp-1">{ticketData.id}</p>
                                            <p className="line-clamp-1">{ticketData.category.name}</p>
                                            <p className="line-clamp-1 font-bold">Rp {ticketData.category.price.toLocaleString()}</p>
                                            <Badge variant="default">{ticketData.reservation?.status}</Badge>
                                            <p className="line-clamp-1">{ticketData.owner.name}</p>
                                        </div>
                                    </div>
                                    <Button onClick={handleVerify} variant="default" className="w-full" disabled={ticketData.isUsed || isVerifying}>
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="size-4 animate-spin" /> Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <Check className="size-4" /> {ticketData.isUsed ? "Already Verified" : "Verify Attendee"}
                                            </>
                                        )}
                                    </Button>
                                </>
                            ) : verified ? (
                                <div className="flex flex-col items-center justify-center py-2 gap-4">
                                    <Check className="size-10 text-green-600 mb-2" />
                                    <p className="text-lg font-semibold text-green-700">Thank you for verifying the attendee!</p>
                                    <Button
                                        onClick={() => {
                                            setTicketData(null);
                                            setVerified(false);
                                            setTicketError("");
                                            startScan();
                                        }}
                                        variant="outline"
                                        className="w-full"
                                    >
                                        <RotateCcw className="size-4 mr-2" /> Scan Another Ticket
                                    </Button>
                                </div>
                            ) : (
                                isLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="size-6 animate-spin text-muted-foreground" />
                                    </div>
                                ) : ticketError === "used" ? (
                                    <p className="text-sm text-yellow-600 font-semibold">Ticket is already used. Please scan another QR Code</p>
                                ) : ticketError === "used" ? (
                                    <p className="text-sm text-yellow-600 font-semibold">Ticket is already used. Please scan another QR Code</p>
                                ) : ticketError === "notfound" ? (
                                    <p className="text-sm text-red-500">Ticket not found or invalid. Please scan another QR Code</p>
                                ) : ticketError === "unauthorized" ? (
                                    <p className="text-sm text-red-500 font-semibold">User is not authorized to verify tickets.</p>
                                ) : (
                                    scannedText && <p className="text-sm text-red-500">Ticket not found or invalid. Please scan another QR Code</p>
                                )
                            )}
                        </CardContent>
                        <CardFooter className="flex flex-col gap-2 items-start">
                            <p className="text-xs lg:text-sm text-muted-foreground">
                                Tips for better scanning:
                            </p>
                            <ul className="list-disc list-inside text-xs lg:text-sm text-muted-foreground">
                                <li>Hold your device steady</li>
                                <li>Ensure good lighting</li>
                                <li>Keep the QR code within the scanning area</li>
                                <li>Clean your camera lens if needed</li>
                            </ul>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
