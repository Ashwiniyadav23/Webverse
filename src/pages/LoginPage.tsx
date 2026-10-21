
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveAuth, type AuthData } from "../utils/auth";
import { apiUrl } from "../utils/api";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const registrationMessage =
        (location.state as { message?: string } | null)?.message || "";
    const redirectPath =
        (location.state as { from?: string } | null)?.from || "";

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(apiUrl("auth/login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }

            const authData = data as AuthData;
            saveAuth(authData);

            navigate(
                authData.user.role === "student"
                    ? redirectPath || "/dashboard"
                    : authData.user.role === "teacher"
                        ? "/teacher"
                        : "/admin",
                { replace: true }
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
                <Link to="/" className="text-sm font-semibold text-indigo-600">
                    ← Back to WebVerse
                </Link>

                <div className="mt-8">
                    <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                        Welcome back
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Sign in to WebVerse
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Continue your learning journey.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    {registrationMessage && (
                        <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                            {registrationMessage}
                        </p>
                    )}
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
                        Create account
                    </Link>
                </p>
            </div>
        </main>
    );
}
