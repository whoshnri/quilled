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

export async function fetchDashboardData({ username, uuid, token, fallbackData = null }) {
  const cacheKey = `cache:dashboard:${username}:${uuid}`;

  try {
    const response = await fetch(`${API}/dashboard/${username}/${uuid}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to load dashboard data.");
    }

    try {
      localStorage.setItem(cacheKey, JSON.stringify(data?.data || {}));
    } catch {
      // ignore cache write failures
    }

    return { ok: true, data: data?.data || {}, fallback: false };
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

    return { ok: false, error: error.message || "Network error while loading dashboard." };
  }
}

export async function updateUserProfile({ uuid, payload, token }) {
  try {
    const response = await fetch(`${API}/user/profile/${uuid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await parseJson(response);
    if (!response.ok) {
      return { ok: false, error: data?.message || "Failed to update profile." };
    }

    return { ok: true, data: data?.data || {} };
  } catch (error) {
    return { ok: false, error: error.message || "Network error while updating profile." };
  }
}

export async function deleteDashboardBlog({ pid, token }) {
  try {
    const response = await fetch(`${API}/delete/${pid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await parseJson(response);
    if (!response.ok) {
      return { ok: false, error: data?.message || "Failed to delete blog." };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message || "Network error while deleting blog." };
  }
}
