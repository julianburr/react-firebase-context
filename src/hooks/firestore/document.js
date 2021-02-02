import { useContext } from "react";

import { FirestoreContext } from "./context";

export function useDocument(query, options) {
  const cacheKey = options?.key || query.path;

  const { cache, setCache } = useContext(FirestoreContext);
  let cacheItem = cache[cacheKey];

  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });
    setCache((state) => ({ ...state, [cacheKey]: cacheItem }));

    query.onSnapshot((snap) => {
      const item = { id: snap.id, ...snap.data() };
      console.log("onSnapshot", { item, snap });
      setCache((state) => ({
        ...state,
        [cacheKey]: { ...state[cacheKey], data: item },
      }));
      cacheItem?.resolve();
    });
  }

  if (options?.suspense === false) {
    return {
      data: cacheItem?.data,
      loading: cacheItem?.data === undefined && cacheItem?.promise,
    };
  }

  if (cacheItem?.data === undefined && cacheItem?.promise) {
    throw cacheItem.promise;
  }

  return cacheItem?.data;
}
