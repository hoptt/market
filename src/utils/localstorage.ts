export const RECENT_KEYWORDS_KEY = "recent_keywords_[]";
export const RECENT_ITEM_IDS_KEY = "recent_item_ids_[]";

type ArrayKeys = typeof RECENT_KEYWORDS_KEY | typeof RECENT_ITEM_IDS_KEY;
const getArray = (key: ArrayKeys) => {
  try {
    const items = localStorage.getItem(key);
    if (items) {
      return JSON.parse(items);
    }
    return [];
  } catch {
    return [];
  }
};

const setArray = (key: ArrayKeys, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(key));
};

export const getRecentKeywords = (): string[] => getArray(RECENT_KEYWORDS_KEY);

export const addRecentKeyword = (value: unknown) => {
  const prevKeywords = getRecentKeywords();
  const arr = Array.from(new Set([value, ...prevKeywords]));
  setArray(RECENT_KEYWORDS_KEY, [...arr]);
};

export const clearRecentKeyword = () => {
  setArray(RECENT_KEYWORDS_KEY, []);
};

export const getRecentItemIds = (): string[] => {
  return getArray(RECENT_ITEM_IDS_KEY);
};

export const addRecentItemId = (productId: string) => {
  const ids = getRecentItemIds();
  const existItem = Array.from(new Set([productId, ...ids]));
  setArray(RECENT_ITEM_IDS_KEY, [...existItem]);
};

export const removeRecentItemId = (productId: string) => {
  const ids = getRecentItemIds();
  const filteredIds = ids.filter((id) => id !== productId);
  setArray(RECENT_ITEM_IDS_KEY, [...filteredIds]);
};
