
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/api";
export default function RegisterPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath =
        (location.state as { from?: string } | null)?.from || "/dashboard";

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                apiUrl("auth/register"),
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed.");
            }

            navigate("/login", {
                replace: true,
                state: {
                    message:
                        data.message ||
                        "Registration successful. Please sign in to continue.",
                    from: redirectPath,
                },
            });
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
                        Start learning
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-slate-500">
                        Join WebVerse and start building your coding skills.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            autoComplete="name"
                            required
                            maxLength={100}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

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
                            autoComplete="new-password"
                            minLength={8}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 8 characters"
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-700">
                            Confirm password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your password"
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
                        {loading ? "Creating account..." : "Create Student Account"}
                    </button>

                    <p className="text-xs text-slate-500">
                        New accounts are registered as students. Admin access is assigned separately.
                    </p>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}
