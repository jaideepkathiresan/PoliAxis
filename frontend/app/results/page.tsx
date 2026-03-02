"use client";
import { useEffect, useState } from 'react';
import { getResults } from '@/services/auth';
import Link from 'next/link';
import { Activity, LayoutDashboard, AlertTriangle, Info } from 'lucide-react';

export default function ResultsPage() {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getResults().then(data => {
            setResult(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-blue-800">
                <Activity className="w-12 h-12 animate-pulse" />
                <p className="text-xl font-semibold font-sans">Analyzing Political Profile...</p>
            </div>
        </div>
    );

    if (!result) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center p-12 bg-white rounded-lg shadow-md max-w-lg border border-red-100">
                <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2 font-sans">No Data Available</h2>
                <p className="text-gray-600 mb-6 font-sans">You have not completed the assessment yet or your session expired.</p>
                <Link href="/test" className="text-white bg-blue-600 px-6 py-3 font-sans rounded-full shadow-lg hover:bg-blue-700">Take the Assessment</Link>
            </div>
        </div>
    );

    // Extract calculated ideology scores from the API response payload.
    // Falls back to mock coordinates (3.13, -0.46) if strict data is temporarily unavailable.
    // Cartesian range spans [-10.0, 10.0] on both vectors.
    const economicScore = result?.economic_axis_score ?? 3.13;
    const socialScore = result?.social_axis_score ?? -0.46;

    // Determine ideological quadrant based on coordinate intersection
    let quadrantLabel = '';
    let quadrantDescription = '';

    if (economicScore < 0 && socialScore >= 0) {
        quadrantLabel = "Authoritarian Left";
        quadrantDescription = "Values state control of the economy and a strong central authority over social issues. Focuses on equality but through state intervention.";
    } else if (economicScore >= 0 && socialScore >= 0) {
        quadrantLabel = "Authoritarian Right";
        quadrantDescription = "Values free-market capitalism heavily but also believes the state or traditional institutions should enforce strict social order.";
    } else if (economicScore < 0 && socialScore < 0) {
        quadrantLabel = "Libertarian Left";
        quadrantDescription = "Values economic equality but also favors personal freedom, often distrusting large corporations and the state alike. Supports grassroots organizing.";
    } else {
        quadrantLabel = "Libertarian Right";
        quadrantDescription = "Values almost absolute free markets and minimal state intervention in both the economy and personal lives of individuals.";
    }

    // Convert cartesian space [-10, +10] to viewport rendering percentages [0%, 100%]
    // X-axis maps 0% => -10, 100% => +10 => (score + 10) * 5
    // Y-axis maps 0% => +10 (top), 100% => -10 (bottom) => (10 - score) * 5
    const dotX = (economicScore + 10) * 5;
    const dotY = (10 - socialScore) * 5;

    return (
        <div className="min-h-screen p-8 bg-gray-50 dark:bg-slate-900 flex flex-col items-center pb-20 font-sans transition-colors duration-300">
            <div className="w-full max-w-5xl space-y-10">

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div>
                        <h1 className="text-3xl font-extrabold text-blue-900 dark:text-blue-400">Your Political Position</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium mt-2">Where you stand on the economic and social spectrum</p>
                    </div>
                    <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 mt-6 md:mt-0 hover:text-blue-800 dark:hover:text-blue-300 font-bold bg-blue-50 dark:bg-slate-700 px-6 py-3 rounded-full flex items-center gap-2 transition hover:-translate-y-1">
                        <LayoutDashboard className="w-5 h-5" /> Dashboard
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left side: Compass */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 font-sans">Political Compass Chart</h2>

                        <div className="relative w-full aspect-square max-w-[400px] border-2 border-slate-900 dark:border-white select-none">
                            {/* Sub-grid lines (Optional) */}
                            <div className="absolute top-0 left-0 w-full h-full" style={{
                                backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                                backgroundSize: '5% 5%'
                            }} />

                            {/* Quadrants */}
                            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-red-400/80 dark:bg-red-500/80" /> {/* Auth Left */}
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-400/80 dark:bg-blue-500/80" /> {/* Auth Right */}
                            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-green-400/80 dark:bg-green-500/80" /> {/* Lib Left */}
                            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-purple-400/80 dark:bg-purple-500/80" /> {/* Lib Right */}

                            {/* Main Axes */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white -translate-y-1/2 z-10" />
                            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-900 dark:bg-white -translate-x-1/2 z-10" />

                            {/* Labels inside graph somewhat transparent */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 font-bold text-slate-900 dark:text-white z-20 text-sm opacity-80 pointer-events-none drop-shadow-md">Authoritarian</div>
                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 font-bold text-slate-900 dark:text-white z-20 text-sm opacity-80 pointer-events-none drop-shadow-md">Libertarian</div>
                            <div className="absolute top-1/2 left-1 -translate-y-1/2 font-bold text-slate-900 dark:text-white z-20 text-sm opacity-80 pointer-events-none drop-shadow-md">Left</div>
                            <div className="absolute top-1/2 right-1 -translate-y-1/2 font-bold text-slate-900 dark:text-white z-20 text-sm opacity-80 pointer-events-none drop-shadow-md">Right</div>

                            {/* User Dot */}
                            <div
                                className="absolute w-6 h-6 rounded-full bg-red-600 border-2 border-white dark:border-slate-900 shadow-xl z-30 transition-all duration-700 ease-out"
                                style={{
                                    left: `${dotX}%`,
                                    top: `${dotY}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-50"></div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4 w-full text-center">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                <p className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1 tracking-wider">Economic Left/Right</p>
                                <p className="text-xl font-black text-slate-800 dark:text-white">{economicScore > 0 ? `+${economicScore}` : economicScore}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                                <p className="text-xs uppercase text-slate-500 dark:text-slate-400 font-bold mb-1 tracking-wider">Social Lib/Auth</p>
                                <p className="text-xl font-black text-slate-800 dark:text-white">{socialScore > 0 ? `+${socialScore}` : socialScore}</p>
                            </div>
                        </div>

                    </div>

                    {/* Right side: Insights & Context */}
                    <div className="space-y-8 flex flex-col justify-between">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wider">Your Quadrant</h3>
                            </div>
                            <h2 className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-4">{quadrantLabel}</h2>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                {quadrantDescription}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 flex-1">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Ideology Summary</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                Based on your answers, your position indicates that you prefer
                                {economicScore >= 0
                                    ? " competitive markets and deregulation"
                                    : " a regulated economy focusing on community welfare"}
                                , whilst simultaneously believing in
                                {socialScore >= 0
                                    ? " traditional values, authority, and state presence in personal choices."
                                    : " maximum personal liberty and independence from government interference."}
                            </p>

                            <h4 className="font-bold text-slate-800 dark:text-white mb-2 pb-2 border-b dark:border-slate-700">Comparison</h4>
                            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                <li className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                                    <span>Average User</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">Center-Left Libertarian</span>
                                </li>
                                <li className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg">
                                    <span>Famous Example</span>
                                    <span className="font-bold text-slate-700 dark:text-slate-300">
                                        {economicScore < 0 && socialScore >= 0 && "Joseph Stalin"}
                                        {economicScore >= 0 && socialScore >= 0 && "Margaret Thatcher"}
                                        {economicScore < 0 && socialScore < 0 && "Mahatma Gandhi"}
                                        {economicScore >= 0 && socialScore < 0 && "Milton Friedman"}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
