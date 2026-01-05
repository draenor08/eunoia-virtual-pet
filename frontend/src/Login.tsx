import { useState } from "react";
import { API_URL } from "./config";

interface LoginProps {
    onLoginSuccess: (user: any) => void;
    onGoToRegister: () => void;
}

export default function Login({ onLoginSuccess, onGoToRegister }: LoginProps) {
    const [username, setUsername] = useState("usingphru");
    const [password, setPassword] = useState("1234");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error("Invalid credentials");
            }

            const user = await res.json();
            onLoginSuccess(user);
        } catch (err) {
            setError("Invalid username or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#b8e3ea] p-4 font-sans">
            <div className="w-full max-w-[420px] bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white relative overflow-hidden">

                {/* Decorative Blob */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#e6a394] rounded-full mix-blend-multiply filter blur-xl opacity-20 pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#b8e3ea] rounded-full mix-blend-multiply filter blur-xl opacity-50 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fdfbf9] text-4xl shadow-md border-4 border-[#efeae6]">
                        🌱
                    </div>
                    <h1 className="text-3xl font-extrabold text-[#5c4b43]">Welcome Back</h1>
                    <p className="mt-2 text-sm text-[#8c7e76]">Your digital sanctuary awaits.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-5 py-3 text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20 placeholder-[#d6ccc8]"
                            placeholder="username"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-5 py-3 text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20 placeholder-[#d6ccc8]"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-3 text-center text-xs font-bold text-red-500 border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-[#5c4b43] py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#4a3b36] hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center text-xs text-[#8c7e76] relative z-10">
                    <p>New here? <button onClick={onGoToRegister} className="font-bold text-[#5c4b43] underline decoration-2 underline-offset-2 hover:text-[#e6a394] transition-colors">Create an account</button></p>
                </div>
            </div>
        </div>
    );
}
