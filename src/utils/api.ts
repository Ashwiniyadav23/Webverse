
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://webverse-backend.vercel.app/api"
).replace(/\/+$/, "");

export function apiUrl(path: string): string {
  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
  
