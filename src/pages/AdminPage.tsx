
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../utils/auth";
import { apiUrl } from "../utils/api";

export default function AdminPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying admin access...");
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalStudents: number;
    totalAdmins: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    if (
      !auth?.token ||
      !["super_admin", "school_admin"].includes(auth.user.role)
    ) {
      navigate("/login", { replace: true });
      return;
    }

    fetch(apiUrl("admin/dashboard"), {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Access denied");
        }

        setMessage(data.message);
        if (data.stats) {
          setStats(data.stats);
        }
      })
      .catch((error: Error) => {
        setMessage(error.message);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function logout() {
    clearAuth();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            WEBVERSE ADMIN
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Admin Panel
          </h1>
        </div>

        <button
          onClick={logout}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats ? stats.totalStudents : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Registered student accounts
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Administrators</h2>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats ? stats.totalAdmins : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Super admins & school admins
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats ? stats.totalUsers : "—"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            All registered platform users
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Backend status</h2>
        <p className="mt-3 text-slate-600">
          {loading ? "Checking..." : message}
        </p>
        <Link
          to="/"
          className="mt-5 inline-block text-indigo-600 hover:underline"
        >
          Back to WebVerse
        </Link>
      </section>
    </main>
  );
}
