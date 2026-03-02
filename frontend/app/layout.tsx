import "./globals.css";
import React from 'react';

export const metadata = {
    title: "PsychoPolitical Analytics Platform",
    description: "Behavioral analytics dashboard mapping psychological traits to political tendencies.",
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="antialiased font-sans bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                {children}
            </body>
        </html>
    );
}
