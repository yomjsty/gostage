import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
    Row,
    Column,
    Tailwind,
    Img,
} from '@react-email/components';

interface iAppProps {
    eventTitle: string;
    eventDate: string;
    location: string;
    organizer: string;
    quantity: number;
    orderId: string;
    totalAmount: number;
    qrCodes: { ticketId: string; category: string; qrBase64: string }[]; // qrBase64 now contains URL
}

export function ETicketEmail({ eventTitle, eventDate, location, organizer, quantity, orderId, totalAmount, qrCodes }: iAppProps) {
    return (
        <Html lang="en" dir="ltr">
            <Tailwind>
                <Head />
                <Preview>Your e-ticket is ready for {eventTitle}! Event details and QR code inside.</Preview>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-lg max-w-[600px] mx-auto">
                        <Section className="bg-blue-600 text-white text-center py-[32px] rounded-t-[8px]">
                            <Img
                                src="https://9ngfbtnuh6.ufs.sh/f/jElL9uwVxPHyoboTHmyLBpODIvfmqjboSJr4kQYXVU9wTeGh"
                                alt="GoStage Logo"
                                className="w-[120px] h-auto object-cover mx-auto mb-[16px]"
                            />
                            <Heading className="text-[28px] font-bold m-0">Your E-Ticket</Heading>
                            <Text className="text-[16px] m-0 mt-[8px] opacity-90">
                                Thank you for choosing GoStage!
                            </Text>
                        </Section>

                        {/* Ticket Details */}
                        <Section className="px-[32px] py-[24px]">
                            <Text className="text-[18px] font-semibold text-gray-800 mb-[16px]">
                                Event Details
                            </Text>

                            <div className="bg-gray-50 rounded-[8px] p-[20px] mb-[24px]">
                                <Row>
                                    <Column>
                                        <Text className="text-[16px] font-semibold text-gray-700 m-0">
                                            {eventTitle}
                                        </Text>
                                        <Text className="text-[14px] text-gray-600 m-0 mt-[4px]">
                                            {/* {new Date(eventDate).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} */}
                                            {eventDate}
                                        </Text>
                                        <Text className="text-[14px] text-gray-600 m-0 mt-[4px]">
                                            {location}
                                        </Text>
                                    </Column>
                                </Row>
                            </div>

                            {/* Ticket Information */}
                            <Row className="mb-[16px]">
                                <Column className="w-1/2">
                                    <Text className="text-[14px] text-gray-600 m-0">Organizer</Text>
                                    <Text className="text-[16px] font-semibold text-gray-800 m-0">
                                        {organizer}
                                    </Text>
                                </Column>
                                <Column className="w-1/2">
                                    <Text className="text-[14px] text-gray-600 m-0">Quantity</Text>
                                    <Text className="text-[16px] font-semibold text-gray-800 m-0">
                                        {quantity}
                                    </Text>
                                </Column>
                            </Row>

                            <Row className="mb-[16px]">
                                <Column className="w-1/2">
                                    <Text className="text-[14px] text-gray-600 m-0">Order ID</Text>
                                    <Text className="text-[16px] font-semibold text-gray-800 m-0">
                                        {orderId}
                                    </Text>
                                </Column>
                                <Column className="w-1/2">
                                    <Text className="text-[14px] text-gray-600 m-0">Order Total</Text>
                                    <Text className="text-[16px] font-semibold text-gray-800 m-0">
                                        Rp {totalAmount.toLocaleString('id-ID')}
                                    </Text>
                                </Column>
                            </Row>

                            <Hr className="my-[24px] border-gray-200" />

                            {/* QR Codes Section */}
                            <Section className="text-center bg-gray-50 rounded-[8px] p-[24px]">
                                <Text className="text-[16px] font-semibold text-gray-800 mb-[16px]">
                                    Your QR Codes
                                </Text>

                                {/* Multiple QR Codes */}
                                <div className="space-y-[16px]">
                                    {qrCodes.map((qr, index) => (
                                        <div key={index} className="bg-white rounded-[8px] p-[16px] border border-gray-200">
                                            <Row>
                                                <Column className="w-1/3 text-center">
                                                    <Img
                                                        src={qr.qrBase64}
                                                        alt={`QR Code ${index + 1}`}
                                                        className="w-[80px] h-[80px] object-cover mx-auto"
                                                        width={80}
                                                        height={80}
                                                    />
                                                </Column>
                                                <Column className="w-2/3 text-left pl-[16px]">
                                                    <Text className="text-[14px] font-semibold text-gray-800 m-0">
                                                        Ticket #{index + 1}
                                                    </Text>
                                                    <Text className="text-[12px] text-gray-600 m-0 mt-[4px]">
                                                        Ticket ID: {qr.ticketId}
                                                    </Text>
                                                    <Text className="text-[12px] text-gray-600 m-0 mt-[2px]">
                                                        Category: {qr.category}
                                                    </Text>
                                                </Column>
                                            </Row>
                                        </div>
                                    ))}
                                </div>

                                <Text className="text-[14px] text-gray-600 mt-[16px] m-0">
                                    Present each QR code at the venue entrance
                                </Text>
                            </Section>

                            <Hr className="my-[24px] border-gray-200" />

                            {/* Important Information */}
                            <Section>
                                <Text className="text-[16px] font-semibold text-gray-800 mb-[12px]">
                                    Important Information
                                </Text>
                                <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                                    • Please arrive 30 minutes before the event starts
                                </Text>
                                <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                                    • Bring a valid ID for verification
                                </Text>
                                <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                                    • Each ticket holder must present their individual QR code
                                </Text>
                                <Text className="text-[14px] text-gray-600 mb-[8px] m-0">
                                    • These tickets are non-transferable and non-refundable
                                </Text>
                                <Text className="text-[14px] text-gray-600 m-0">
                                    • For support, contact us at support@gostage.vercel.app
                                </Text>
                            </Section>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-gray-100 px-[32px] py-[24px] rounded-b-[8px]">
                            <Text className="text-[12px] text-gray-600 text-center m-0">
                                GoStage Inc.<br />
                            </Text>
                            <Text className="text-[12px] text-gray-600 text-center m-0 mt-[8px]">
                                <a href="#" className="text-blue-600 underline">Unsubscribe</a> |
                                © 2025 GoStage Inc.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};