import { useContext } from "react";
import invariant from "invariant";

import { FirestoreContext } from "./context";

export function useCollection(query, options) {
  const cacheKey = options?.key;
  invariant(cacheKey, "You need to define a key for collections.");

  const { cache, setCache } = useContext(FirestoreContext);
  let cacheItem = cache[cacheKey];

  if (cacheItem === undefined) {
    cacheItem = {};
    cacheItem.promise = new Promise((resolve) => {
      cacheItem.resolve = resolve;
    });
    setCache((state) => ({ ...state, [cacheKey]: cacheItem }));

    query.onSnapshot((snap) => {
      let items = [];
      snap.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });

      setCache((state) => ({
        ...state,
        [cacheKey]: { ...state[cacheKey], data: items },
      }));
      cacheItem?.resolve();
    });
  }

  if (options?.suspense === false) {
    return {
      data: cacheItem?.item,
      loading: cacheItem?.data === undefined && cacheItem?.promise,
    };
  }

  if (cacheItem?.data === undefined && cacheItem?.promise) {
    throw cacheItem.promise;
  }

  return cacheItem?.data;
}
