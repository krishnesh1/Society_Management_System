import { useCallback, useRef, useState } from "react";
import {
  ADMIN_KEYS,
  fetchResources,
  GLOBAL_PRELOAD,
  RESOURCE_KEYS,
  VIEW_LOAD_TIERS,
  VIEW_RESOURCES
} from "../services/api.js";

export const emptyData = {
  announcements: [],
  complaints: [],
  visitors: [],
  bills: [],
  events: [],
  polls: [],
  notifications: [],
  residents: [],
  adminRequests: [],
  stats: {}
};

function filterKeys(keys, user) {
  return keys.filter((key) => {
    if (ADMIN_KEYS.includes(key) && user?.role !== "admin") return false;
    return true;
  });
}

export function useAppData() {
  const [data, setData] = useState(emptyData);
  const [dataLoading, setDataLoading] = useState(false);
  const [viewReady, setViewReady] = useState({});
  const cacheRef = useRef({});
  const inflightRef = useRef(new Set());

  const mergeData = useCallback((patch) => {
    setData((current) => ({ ...current, ...patch }));
    Object.assign(cacheRef.current, patch);
  }, []);

  const fetchKeys = useCallback(async (keys, user) => {
    const pending = filterKeys(keys, user).filter((key) => {
      if (cacheRef.current[key] !== undefined) return false;
      const token = `${key}`;
      if (inflightRef.current.has(token)) return false;
      inflightRef.current.add(token);
      return true;
    });

    if (pending.length === 0) return;

    try {
      const patch = await fetchResources(pending, user);
      mergeData(patch);
    } finally {
      pending.forEach((key) => inflightRef.current.delete(key));
    }
  }, [mergeData]);

  const loadForView = useCallback(async (view, user) => {
    if (!user) return;

    const tier = VIEW_LOAD_TIERS[view];
    if (tier) {
      const priorityPending = filterKeys(tier.priority, user).some(
        (key) => cacheRef.current[key] === undefined
      );

      if (priorityPending) {
        setDataLoading(true);
        try {
          await fetchKeys(tier.priority, user);
          setViewReady((current) => ({ ...current, [view]: true }));
        } finally {
          setDataLoading(false);
        }
      } else {
        setViewReady((current) => ({ ...current, [view]: true }));
      }

      fetchKeys(tier.deferred, user);
      return;
    }

    const keys = VIEW_RESOURCES[view] || RESOURCE_KEYS;
    const pending = filterKeys(keys, user).some((key) => cacheRef.current[key] === undefined);

    if (!pending) {
      setViewReady((current) => ({ ...current, [view]: true }));
      return;
    }

    setDataLoading(true);
    try {
      await fetchKeys(keys, user);
      setViewReady((current) => ({ ...current, [view]: true }));
    } finally {
      setDataLoading(false);
    }
  }, [fetchKeys]);

  const preloadGlobal = useCallback(async (user) => {
    if (!user) return;
    await fetchKeys(GLOBAL_PRELOAD, user);
  }, [fetchKeys]);

  const refreshKeys = useCallback(async (keys, user) => {
    if (!user || !keys?.length) return;
    setDataLoading(true);
    try {
      keys.forEach((key) => {
        delete cacheRef.current[key];
      });
      const patch = await fetchResources(filterKeys(keys, user), user);
      mergeData(patch);
    } finally {
      setDataLoading(false);
    }
  }, [mergeData]);

  const patchResource = useCallback((key, updater) => {
    setData((current) => {
      const nextValue = typeof updater === "function" ? updater(current[key]) : updater;
      cacheRef.current[key] = nextValue;
      return { ...current, [key]: nextValue };
    });
  }, []);

  const resetData = useCallback(() => {
    cacheRef.current = {};
    inflightRef.current.clear();
    setData(emptyData);
    setViewReady({});
  }, []);

  return {
    data,
    dataLoading,
    viewReady,
    loadForView,
    preloadGlobal,
    refreshKeys,
    patchResource,
    resetData
  };
}
