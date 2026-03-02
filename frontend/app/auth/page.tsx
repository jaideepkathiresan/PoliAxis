"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/services/auth';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await login(email, password);
                localStorage.setItem('token', res.access_token);
                router.push('/dashboard');
            } else {
                await register(email, password);
                const res = await login(email, password);
                localStorage.setItem('token', res.access_token);
                router.push('/dashboard');
            }
        } catch (error) {
            alert("Authentication failed. Please check credentials or if user already exists.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-slate-900 transition-colors">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-transparent dark:border-slate-700 transition-colors">
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">{isLogin ? 'Login' : 'Register'}</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-slate-700 focus:ring-blue-500 focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}
