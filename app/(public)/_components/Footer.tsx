import Link from 'next/link'

const links = [
    {
        title: 'Terms & Conditions',
        href: '/terms',
    },
    {
        title: 'Privacy Policy',
        href: '/privacy',
    },
    {
        title: 'Faq',
        href: '/faq',
    },
    {
        title: 'Contact',
        href: '/contact',
    },
    {
        title: 'About',
        href: '/about',
    },
]

export function Footer() {
    return (
        <footer className="border-t bg-white py-12 dark:bg-transparent">
            <div className="mx-auto container px-4 md:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between gap-6">
                    <span className="text-muted-foreground order-last block text-center text-sm md:order-first">© {new Date().getFullYear()} GoStage, All rights reserved</span>
                    <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
                        {links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.href}
                                className="text-muted-foreground hover:text-primary block duration-150">
                                <span>{link.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}