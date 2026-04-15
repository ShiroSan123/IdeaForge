const STORAGE_KEY = "idea-forge-favorites";

function canUseStorage() {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

function readFavorites() {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read favorites from localStorage", error);
    return [];
  }
}

function writeFavorites(favorites) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

function createId() {
  return `idea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getFavoriteIdeas() {
  return readFavorites().sort((a, b) => {
    const first = new Date(b.createdAt || 0).getTime();
    const second = new Date(a.createdAt || 0).getTime();
    return first - second;
  });
}

export function saveFavoriteIdea(idea) {
  const favorites = readFavorites();
  const existing = favorites.find((item) => item.title === idea.title);

  if (existing) {
    const updated = {
      ...existing,
      ...idea,
      id: existing.id,
      is_favorite: true,
    };
    writeFavorites(
      favorites.map((item) => (item.id === existing.id ? updated : item)),
    );
    return updated;
  }

  const savedIdea = {
    ...idea,
    id: idea.id || createId(),
    is_favorite: true,
    createdAt: new Date().toISOString(),
  };

  writeFavorites([savedIdea, ...favorites]);
  return savedIdea;
}

export function removeFavoriteIdea(idOrTitle) {
  const favorites = readFavorites();
  writeFavorites(
    favorites.filter(
      (item) => item.id !== idOrTitle && item.title !== idOrTitle,
    ),
  );
}

export function updateFavoriteIdea(id, updates) {
  const favorites = readFavorites();
  const updatedFavorites = favorites.map((item) =>
    item.id === id ? { ...item, ...updates, id: item.id } : item,
  );
  writeFavorites(updatedFavorites);
  return updatedFavorites.find((item) => item.id === id) || null;
}
