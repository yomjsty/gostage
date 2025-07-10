export const metadata = {
    title: "Contact",
    description: "Contact GoStage",
};

export default function ContactPage() {
    return (
        <main className="max-w-3xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p>
                Have questions or want to become an organizer? Reach us at:
            </p>
            <ul className="list-disc pl-6 mt-2">
                <li>Email: <span className="line-through">support@gostage.vercel.app</span></li>
                <li>Instagram: <span className="line-through">@gostage.id</span></li>
            </ul>
        </main>
    );
}