type HttpClient = {
  get<T>(endpoint: string): Promise<T>;
  post<T>(endpoint: string, body?: any): Promise<T>;
};

function getOrigin(url: string) {
  try { return new URL(url).origin; } catch { return null; }
}

export function ApiClient(baseURL: string, timeoutMs = 15000): HttpClient {
  const baseOrigin = getOrigin(baseURL);
  const allowedOrigins = new Set<string>([
    // normalized origins (no trailing slash)
    (getOrigin("https://vimarsh-backend.onrender.com") || "https://vimarsh-backend.onrender.com"),
    (getOrigin("http://localhost:4000") || "http://localhost:4000"),
  ]);
  if (baseOrigin) allowedOrigins.add(baseOrigin);

  async function fetchWithTimeout(input: string, init: RequestInit = {}) {
    const url = input.startsWith("http") ? input : `${baseURL}${input}`;
    const parsed = new URL(url);

    // Allow only requests to baseOrigin
    if (parsed.origin && !allowedOrigins.has(parsed.origin)) {
      throw { message: "Invalid API origin", status: 400 };
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...init.headers,
        },
      });
      clearTimeout(id);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw { message: `Unexpected content-type: ${text}`, status: res.status };
      }
      const data = await res.json();
      if (!res.ok) {
        throw { message: data?.message || data?.error || "Request failed", status: res.status, raw: data };
      }
      return data;
    } catch (err) {
      clearTimeout(id);
      if (err instanceof Error && err.name === "AbortError") {
        throw { message: "Request timeout", status: 408 };
      }
      throw err;
    }
  }

  return {
    async get<T>(endpoint: string) {
      return fetchWithTimeout(endpoint, { method: "GET" }) as Promise<T>;
    },
    async post<T>(endpoint: string, body?: any) {
      return fetchWithTimeout(endpoint, {
        method: "POST",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      }) as Promise<T>;
    },
  };
}

export const apiClient = ApiClient(import.meta.env.VITE_API_BASE_URL || "http://localhost:4000");