export const metadata = {
    title: "Terms & Conditions",
    description: "GoStage's Terms & Conditions",
};

export default function TermsPage() {
    return (
        <main className="max-w-3xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
            <p className="mb-4">
                By using GoStage, you agree to our terms. Events, ticket prices, and availability are managed by organizers.
                GoStage is not liable for changes made by event organizers.
            </p>
            <p>
                Misuse of the platform or violation of policies can result in account suspension.
            </p>
        </main>
    );
}
