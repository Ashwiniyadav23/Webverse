
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enrollInCourse } from "../services/enrollmentService";

type Props = {
  courseId: string;
  isEnrolled: boolean;
  onEnrolled: (courseId: string) => void;
};

export default function EnrollButton({
  courseId,
  isEnrolled,
  onEnrolled,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleClick() {
    if (isEnrolled) {
      navigate(`/courses/${courseId}`);
      return;
    }

    const saved = localStorage.getItem("webverse-auth");

    if (!saved) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await enrollInCourse(courseId);
      onEnrolled(courseId);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to enroll right now.";

      if (
        message.toLowerCase().includes("log in") ||
        message.toLowerCase().includes("session")
      ) {
        navigate("/login");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 px-4 py-3
          font-semibold text-white transition hover:bg-indigo-700
          disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Enrolling..."
          : isEnrolled
            ? "Continue Learning"
            : "Enroll Now"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
