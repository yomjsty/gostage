import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

interface iAppProps {
    email: string
    url: string
}

export function RequestPasswordResetEmail({ email, url }: iAppProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head />
            <Preview>Reset your password to continue accessing to your GoStage account</Preview>
            <Tailwind>
                <Body className="bg-gray-100 font-sans py-[40px]">
                    <Container className="bg-white rounded-[8px] shadow-sm max-w-[600px] mx-auto px-[40px] py-[32px]">
                        <Section className="text-center mb-[32px]">
                            <Img
                                src="https://9ngfbtnuh6.ufs.sh/f/jElL9uwVxPHyoboTHmyLBpODIvfmqjboSJr4kQYXVU9wTeGh"
                                alt="GoStage Logo"
                                className="w-full h-auto object-cover max-w-[200px] mx-auto mb-[24px]"
                            />
                            <Heading className="text-[28px] font-bold text-gray-900 m-0 mb-[8px]">
                                Reset Your Password
                            </Heading>
                            <Text className="text-[16px] text-gray-600 m-0">
                                We received a request to reset your password for your GoStage account
                            </Text>
                        </Section>

                        {/* Main Content */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                                Hello,
                            </Text>
                            <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                                Someone requested a password reset for your GoStage account associated with <strong>{email}</strong>.
                            </Text>
                            <Text className="text-[16px] text-gray-700 mb-[24px] m-0">
                                Click the button below to create a new password. This link will expire in 30 minutes for security reasons.
                            </Text>
                            <Section className="text-center mb-[24px]">
                                <Button
                                    href={url}
                                    className="bg-blue-600 text-white px-[32px] py-[16px] rounded-[8px] text-[16px] font-semibold no-underline box-border my-2"
                                >
                                    Reset My Password
                                </Button>
                            </Section>

                            <Text className="text-[14px] text-gray-600 mb-[16px] m-0">
                                If the button doesn't work, copy and paste this link into your browser:
                            </Text>
                            <Text className="text-[14px] text-blue-600 mb-[24px] m-0 break-all">
                                <Link href={url} className="text-blue-600 underline">
                                    {url}
                                </Link>
                            </Text>
                        </Section>

                        {/* Security Notice */}
                        <Section className="bg-amber-50 border-l-[4px] border-amber-400 px-[16px] py-[16px] mb-[32px]">
                            <Heading className="text-[18px] font-semibold text-amber-800 m-0 mb-[8px]">
                                Security Notice
                            </Heading>
                            <Text className="text-[14px] text-amber-700 m-0 mb-[8px]">
                                • If you didn't request this password reset, please ignore this email
                            </Text>
                            <Text className="text-[14px] text-amber-700 m-0 mb-[8px]">
                                • Never share your password or reset link with anyone
                            </Text>
                            <Text className="text-[14px] text-amber-700 m-0">
                                • This link will expire automatically for your security
                            </Text>
                        </Section>
                        {/* Support */}
                        <Section className="mb-[32px]">
                            <Text className="text-[16px] text-gray-700 mb-[16px] m-0">
                                Having trouble accessing your account or need help with your event tickets?
                            </Text>
                            <Text className="text-[16px] text-gray-700 m-0">
                                Contact our support team at{' '}
                                <Link href="mailto:support@gostage.com" className="text-blue-600 underline">
                                    support@gostage.com
                                </Link>{' '}
                                or visit our{' '}
                                <Link href="https://gostage.com/help" className="text-blue-600 underline">
                                    Help Center
                                </Link>
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="border-t border-gray-200 pt-[24px]">
                            <Text className="text-[12px] text-gray-500 text-center m-0 mb-[8px]">
                                GoStage
                            </Text>
                            <Text className="text-[12px] text-gray-500 text-center m-0">
                                © 2025 GoStage. All rights reserved. |{' '}
                                <Link href="https://gostage.com/unsubscribe" className="text-gray-500 underline">
                                    Unsubscribe
                                </Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )

}