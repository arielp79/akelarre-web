"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({ barSlug }: { barSlug: string }) {
    const pathname = usePathname();

    const tabs = [
        { name: "Préstamos", href: `/admin/${barSlug}`, icon: "📋" },
        { name: "Ludoteca", href: `/admin/${barSlug}/games`, icon: "🎲" },
    ];

    return (
        <nav className="flex gap-2 mb-8 bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-2xl w-fit">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive
                            ? "bg-white dark:bg-zinc-800 shadow-sm text-indigo-600"
                            : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.name}
                    </Link>
                );
            })}
        </nav>
    );
}