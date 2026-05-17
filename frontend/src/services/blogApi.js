const API = import.meta.env.VITE_API_BASE_URL;

async function parseJson(response) {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function fetchBlogByPid(pid, fallbackData = null) {
  const cacheKey = `cache:blog:${pid}`;

  try {
    const response = await fetch(`${API}/get/blog/${pid}`);
    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to load blog.");
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch {
      // ignore cache write failures
    }

    return { ok: true, data, fallback: false };
  } catch (error) {
    if (fallbackData) {
      return { ok: true, data: fallbackData, fallback: true };
    }

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        return { ok: true, data: JSON.parse(cached), fallback: true };
      }
    } catch {
      // ignore cache read failures
    }

    return { ok: false, error: error.message || "Network error while loading blog." };
  }
}

export async function createBlog(payload, token) {
  try {
    const response = await fetch(`${API}/new/blog`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return { ok: false, error: data?.error || data?.message || "Failed to publish post." };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Network error while publishing post." };
  }
}

export async function updateBlog(pid, payload, token) {
  try {
    const response = await fetch(`${API}/update/${pid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await parseJson(response);

    if (!response.ok) {
      return { ok: false, error: data?.error || data?.message || "Failed to update post." };
    }

    return { ok: true, data };
  } catch (error) {
    return { ok: false, error: error.message || "Network error while updating post." };
  }
}
