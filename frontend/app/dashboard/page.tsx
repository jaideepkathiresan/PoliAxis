"use client";
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="min-h-screen p-12 bg-gray-50 dark:bg-slate-900 transition-colors">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <div className="p-6 bg-white dark:bg-slate-800 shadow rounded-lg border border-gray-200 dark:border-slate-700 transition-colors">
                    <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">Start Assessment</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Complete your psychological, political, and demographic profiling to generate ML insights.</p>
                    <Link href="/test" className="text-white bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md transition-colors">
                        Begin Test
                    </Link>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800 shadow rounded-lg border border-gray-200 dark:border-slate-700 transition-colors">
                    <h2 className="text-xl font-semibold mb-2 text-black dark:text-white">View Results</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Analyze your structural equation modeling and decision tree derivations.</p>
                    <Link href="/results" className="text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors inline-block">
                        Check Results
                    </Link>
                </div>
            </div>
        </div>
    );
}
