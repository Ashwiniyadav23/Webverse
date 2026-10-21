import { apiUrl } from "../utils/api";
import { getAuth } from "../utils/auth";

export type EnrolledCourse = {
  _id: string;
  title: string;
  description: string;
  classLevel: number;
  subject: string;
  thumbnail?: string;
};

export type Enrollment = {
  _id: string;
  enrolledAt: string;
  course: EnrolledCourse;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  enrollments?: T[];
  enrollment?: T;
};

function getToken(): string {
  const token = getAuth()?.token;
  if (!token) {
    throw new Error("Please log in to continue.");
  }
  return token;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });

  const data = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}

export async function getMyEnrollments(): Promise<Enrollment[]> {
  const data = await request<ApiResponse<Enrollment>>("enrollments/me");
  return data.enrollments ?? [];
}

export async function enrollInCourse(courseId: string): Promise<Enrollment> {
  const data = await request<ApiResponse<Enrollment>>(
    `enrollments/${courseId}`,
    { method: "POST" }
  );
  if (!data.enrollment) {
    throw new Error(data.message || "Enrollment failed.");
  }
  return data.enrollment;
}

export async function leaveCourse(courseId: string): Promise<void> {
  await request(`enrollments/${courseId}`, { method: "DELETE" });
}
