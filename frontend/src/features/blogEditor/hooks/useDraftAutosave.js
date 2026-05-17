import { useEffect, useRef, useState } from "react";
import { hasMeaningfulContent } from "../constants";

function hasDraftData(draft) {
  return Boolean(
    draft?.title?.trim() ||
      draft?.category?.trim() ||
      hasMeaningfulContent(draft?.content || ""),
  );
}

export default function useDraftAutosave({ key, draft, enabled = true }) {
  const [restoredDraft, setRestoredDraft] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [restoreError, setRestoreError] = useState("");
  const didRestore = useRef(false);

  useEffect(() => {
    if (!enabled || !key) {
      didRestore.current = true;
      return;
    }

    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRestoredDraft(parsed);
        if (parsed?.savedAt) {
          setLastSavedAt(parsed.savedAt);
        }
      }
    } catch (error) {
      setRestoreError(error.message || "Failed to restore draft.");
    } finally {
      didRestore.current = true;
    }
  }, [enabled, key]);

  useEffect(() => {
    if (!enabled || !key || !didRestore.current) {
      return undefined;
    }

    if (!hasDraftData(draft)) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const savedAt = new Date().toISOString();
      try {
        localStorage.setItem(key, JSON.stringify({ ...draft, savedAt }));
        setLastSavedAt(savedAt);
      } catch (error) {
        setRestoreError(error.message || "Failed to save draft.");
      }
    }, 700);

    return () => window.clearTimeout(timer);
  }, [enabled, key, draft]);

  const clearDraft = () => {
    if (!key) {
      return;
    }
    localStorage.removeItem(key);
    setRestoredDraft(null);
    setLastSavedAt(null);
  };

  return { restoredDraft, lastSavedAt, restoreError, clearDraft };
}
