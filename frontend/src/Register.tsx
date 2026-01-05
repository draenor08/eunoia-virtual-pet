import { useState } from "react";
import { API_URL } from "./config";

interface RegisterProps {
    onRegisterSuccess: (user: any) => void;
    onGoToLogin: () => void;
}

export default function Register({ onRegisterSuccess, onGoToLogin }: RegisterProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    firstName,
                    lastName
                }),
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || "Registration failed");
            }

            const user = await res.json();
            onRegisterSuccess(user);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#b8e3ea] p-4 font-sans">
            <div className="w-full max-w-[500px] bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 shadow-2xl border-4 border-white relative overflow-hidden">

                {/* Decorative Blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#e6a394] rounded-full mix-blend-multiply filter blur-xl opacity-20 pointer-events-none"></div>

                <div className="text-center mb-6 relative z-10">
                    <h1 className="text-3xl font-extrabold text-[#5c4b43]">Create Account</h1>
                    <p className="mt-1 text-xs text-[#8c7e76] uppercase tracking-wide">Start your journey today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">First Name</label>
                            <input
                                required
                                className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-4 py-3 text-sm text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20"
                                value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Jane"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">Last Name</label>
                            <input
                                required
                                className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-4 py-3 text-sm text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20"
                                value={lastName} onChange={(e) => setLastName(e.target.value)}
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">Email</label>
                        <input
                            required type="email"
                            className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-4 py-3 text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="hello@example.com"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">Username</label>
                        <input
                            required
                            className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-4 py-3 text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            placeholder="username"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#5c4b43] uppercase ml-2 tracking-wide">Password</label>
                        <input
                            required type="password"
                            className="w-full rounded-2xl border-2 border-[#efeae6] bg-white px-4 py-3 text-[#5c4b43] outline-none transition-all focus:border-[#e6a394] focus:ring-4 focus:ring-[#e6a394]/20"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-2 text-center text-xs font-bold text-red-500 border border-red-100 animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-full bg-[#e6a394] py-4 text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition-all hover:bg-[#d08d7e] hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:hover:scale-100 mt-2"
                    >
                        {isLoading ? "Creating..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-[#8c7e76] relative z-10">
                    <p>Already have an account? <button onClick={onGoToLogin} className="font-bold text-[#5c4b43] underline decoration-2 underline-offset-2 hover:text-[#e6a394] transition-colors">Log in</button></p>
                </div>
            </div>
        </div>
    );
}
