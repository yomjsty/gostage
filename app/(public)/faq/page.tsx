import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata = {
    title: "FAQ",
    description: "Frequently Asked Questions",
};

const items = [
    {
        id: "1",
        title: "How do I buy tickets?",
        content:
            'Just pick an event, click the "Buy Now" button (if tickets are available), select your ticket, hit checkout, choose your payment method — done!',
    },
    {
        id: "2",
        title: "Can I get a refund?",
        content:
            "Unfortunately, no refunds. Make sure before you buy.",
    },
    {
        id: "3",
        title: "How do I become an organizer?",
        content:
            "Contact us via the Contact page and send details about your event or organization. We'll verify and upgrade your role.",
    },
    {
        id: "4",
        title: "Is the payment secure?",
        content:
            "Yep! We use Midtrans — a secure and trusted payment gateway.",
    },
    {
        id: "5",
        title: "Where can I see my QR code?",
        content:
            "Go to the My Tickets page and click “Show E-Tickets” or check your email after purchase.",
    },
    {
        id: "6",
        title: "How do I scan a QR code?",
        content:
            "Only the organizer of the event can do that. Just go to the Scan QR page and scan. Then hit “Verify Attendee”.",
    },
    {
        id: "7",
        title: "Can I sell my ticket to someone else?",
        content:
            "Not yet — we’re working on a resale feature. Stay tuned!",
    },
    {
        id: "8",
        title: "What if I didn’t receive my e-ticket email?",
        content:
            "Check your spam or go to My Tickets page. You’ll always find them there.",
    },
    {
        id: "9",
        title: "Can I create multiple events as an organizer?",
        content:
            "Yep! Once you're verified as an organizer, you can create and manage as many events as you want.",
    },
    {
        id: "10",
        title: "Do tickets have an expiration time for payment?",
        content:
            "Yes. After selecting tickets, you have 5 minutes to complete the payment. After that, they’ll be released automatically.",
    },
]

export default function FAQPage() {
    return (
        <main className="max-w-3xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
            <Accordion type="single" collapsible className="w-full" defaultValue="1">
                {items.map((item) => (
                    <AccordionItem value={item.id} key={item.id} className="py-2">
                        <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline cursor-pointer font-semibold">
                            {item.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-2">
                            {item.content}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </main>
    )
}