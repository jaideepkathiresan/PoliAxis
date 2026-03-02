"use client";
import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 dark:bg-slate-900 transition-colors">
            <div className="z-10 max-w-5xl w-full items-center justify-between text-center font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8 text-blue-900 dark:text-blue-400">PsychoPolitical Analytics</h1>
                <p className="mb-12 text-lg text-gray-600 dark:text-gray-300">
                    Discover your behavioral tendencies using real machine learning models.
                    Combine your psychological traits, political orientation, and employment status
                    into actionable civic engagement insights.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/auth" className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition">
                        Get Started (Login / Register)
                    </Link>
                </div>
            </div>
        </main>
    );
}
