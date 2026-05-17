import { useCallback, useEffect, useState } from "react";
import { fetchDashboardData } from "../../../services/dashboardApi";

export default function useDashboardData({ username, uuid, token }) {
  const [data, setData] = useState({
    user: { username: "", email: "", uuid: "" },
    stats: { post_count: 0, view_count: 0, like_count: 0, comment_count: 0 },
    blogs: [],
    recent_comments: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  const load = useCallback(async () => {
    if (!username || !uuid || !token) {
      setLoading(false);
      setError("Missing dashboard credentials.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await fetchDashboardData({ username, uuid, token });
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setData(result.data);
    setIsFallback(Boolean(result.fallback));
    setLoading(false);
  }, [username, uuid, token]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, isFallback, reload: load };
}
