// import Footer from "./_components/Footer";
import { Footer } from "./_components/Footer";
import { Navbar } from "./_components/Navbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="">
            <Navbar />
            <main className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
                {children}
            </main>
            <Footer />
        </div>
    )
}
