const rawBase = import.meta.env.VITE_API_BASE_URL ?? "/api";
const base = rawBase.endsWith("/") ? rawBase.slice(0, -1) : rawBase;

export const apiBase = base;

export const apiUrl = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase}${normalized}`;
};
