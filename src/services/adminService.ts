import { apiUrl } from "../utils/api";
import { getAuth } from "../utils/auth";

export interface ResourceItem {
  _id?: string;
  title: string;
  url: string;
  type: "document" | "video" | "link" | "code" | "other";
}

export interface AdminLesson {
  _id: string;
  course: string;
  title: string;
  module: string;
  description: string;
  content: string;
  curriculum?: Record<string, unknown>;
  videoUrl?: string;
  documentUrl?: string;
  resources: ResourceItem[];
  order: number;
  duration: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCourse {
  _id: string;
  title: string;
  description: string;
  classLevel: number;
  subject: string;
  category: string;
  thumbnail?: string;
  published: boolean;
  totalLessons?: number;
  publishedLessons?: number;
  studentCount?: number;
  modules?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalAdmins: number;
  totalCourses: number;
  publishedCourses: number;
  totalLessons: number;
  publishedLessons: number;
}

export interface EnrolledStudentItem {
  enrollmentId: string;
  enrolledAt: string;
  student: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
  };
  progress?: {
    lessonId: string;
    lessonTitle: string;
    order: number;
    isProject: boolean;
    completed: boolean;
    completedTasks: string[];
    completedTopics: string[];
    quizScore: number | null;
    assessmentPassed: boolean;
    assessmentFeedback: string[];
    projectStatus: string | null;
    projectScore: number | null;
    projectFeedback: string[];
  }[];
}

export interface StudentUserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface CourseInput {
  title: string;
  description: string;
  classLevel: number;
  subject: string;
  category: string;
  thumbnail?: string;
  published: boolean;
}

export interface LessonInput {
  title: string;
  module: string;
  description: string;
  content: string;
  curriculum?: Record<string, unknown>;
  videoUrl?: string;
  documentUrl?: string;
  resources: ResourceItem[];
  order: number;
  duration: string;
  published: boolean;
}

function getAuthHeader(): Record<string, string> {
  const auth = getAuth();
  if (!auth?.token) {
    throw new Error("Admin authentication required. Please log in.");
  }
  return {
    Authorization: `Bearer ${auth.token}`,
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export async function fetchAdminDashboardStats(): Promise<{
  message: string;
  stats: AdminStats;
}> {
  return request("admin/dashboard");
}

export async function fetchAdminCourses(params?: {
  q?: string;
  category?: string;
  published?: string;
}): Promise<{
  count: number;
  categories: string[];
  courses: AdminCourse[];
}> {
  const query = new URLSearchParams();
  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.published !== undefined && params.published !== "all") {
    query.set("published", params.published);
  }

  const qs = query.toString() ? `?${query.toString()}` : "";
  return request(`admin/courses${qs}`);
}

export async function fetchAdminCourseDetails(courseId: string): Promise<{
  course: AdminCourse;
  studentCount: number;
  totalLessons: number;
  publishedLessons: number;
  lessons: AdminLesson[];
  modules: { name: string; lessons: AdminLesson[] }[];
}> {
  return request(`admin/courses/${courseId}`);
}

export async function createCourse(data: CourseInput): Promise<{
  message: string;
  course: AdminCourse;
}> {
  return request("admin/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCourse(
  courseId: string,
  data: Partial<CourseInput>
): Promise<{
  message: string;
  course: AdminCourse;
}> {
  return request(`admin/courses/${courseId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function toggleCoursePublish(
  courseId: string,
  published?: boolean
): Promise<{
  message: string;
  published: boolean;
  course: AdminCourse;
}> {
  return request(`admin/courses/${courseId}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ published }),
  });
}

export async function deleteCourse(courseId: string): Promise<{ message: string }> {
  return request(`admin/courses/${courseId}`, {
    method: "DELETE",
  });
}

// Lessons
export async function fetchCourseLessons(courseId: string): Promise<{
  count: number;
  course: AdminCourse;
  lessons: AdminLesson[];
  modules: { name: string; lessons: AdminLesson[] }[];
}> {
  return request(`admin/courses/${courseId}/lessons`);
}

export async function createLesson(
  courseId: string,
  data: LessonInput
): Promise<{
  message: string;
  lesson: AdminLesson;
}> {
  return request(`admin/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLesson(
  lessonId: string,
  data: Partial<LessonInput>
): Promise<{
  message: string;
  lesson: AdminLesson;
}> {
  return request(`admin/lessons/${lessonId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function toggleLessonPublish(
  lessonId: string,
  published?: boolean
): Promise<{
  message: string;
  published: boolean;
  lesson: AdminLesson;
}> {
  return request(`admin/lessons/${lessonId}/publish`, {
    method: "PATCH",
    body: JSON.stringify({ published }),
  });
}

export async function deleteLesson(lessonId: string): Promise<{ message: string }> {
  return request(`admin/lessons/${lessonId}`, {
    method: "DELETE",
  });
}

export async function reorderLessons(
  courseId: string,
  orders: { id: string; order: number; module?: string }[]
): Promise<{
  message: string;
  lessons: AdminLesson[];
}> {
  return request(`admin/courses/${courseId}/lessons/reorder`, {
    method: "PUT",
    body: JSON.stringify({ orders }),
  });
}

// Student Access
export async function fetchCourseStudents(courseId: string): Promise<{
  count: number;
  students: EnrolledStudentItem[];
}> {
  return request(`admin/courses/${courseId}/students`);
}

export async function enrollStudentInCourse(
  courseId: string,
  payload: { studentId?: string; email?: string }
): Promise<{
  message: string;
  enrollment: EnrolledStudentItem;
}> {
  return request(`admin/courses/${courseId}/students`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function removeStudentFromCourse(
  courseId: string,
  studentId: string
): Promise<{ message: string }> {
  return request(`admin/courses/${courseId}/students/${studentId}`, {
    method: "DELETE",
  });
}

export async function fetchRegisteredStudents(q?: string): Promise<{
  count: number;
  students: StudentUserItem[];
}> {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return request(`admin/students${qs}`);
}
