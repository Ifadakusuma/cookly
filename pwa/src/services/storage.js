const FAVORITES_KEY = "cookly_favorites_v1";
const MY_RECIPES_KEY = "cookly_my_recipes_v1";
const PROFILE_KEY = "cookly_user_profile_v1";
const GROCERIES_KEY = "cookly_groceries_v1";

export const StorageService = {
  // --- FAVORITES ---
  getFavorites() {
    try {
      const data = localStorage.getItem(FAVORITES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  isFavorite(recipeId) {
    const list = this.getFavorites();
    return list.some((item) => String(item.id) === String(recipeId));
  },

  toggleFavorite(recipe) {
    let list = this.getFavorites();
    const exists = list.some((item) => String(item.id) === String(recipe.id));

    if (exists) {
      list = list.filter((item) => String(item.id) !== String(recipe.id));
    } else {
      // Save compact representation of recipe
      list.unshift({
        id: recipe.id,
        title: recipe.title,
        description: recipe.description,
        image_url: recipe.image_url,
        category: recipe.category,
        category_id: recipe.category_id,
        average_rating: recipe.average_rating || 0,
        review_count: recipe.review_count || 0,
        saved_at: new Date().toISOString(),
      });
    }

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Gagal menyimpan favorit ke local storage", e);
    }

    return !exists; // true jika baru ditambahkan, false jika dihapus
  },

  // --- MY RECIPES ---
  getMyRecipes() {
    try {
      const data = localStorage.getItem(MY_RECIPES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addMyRecipe(recipe) {
    let list = this.getMyRecipes();
    list.unshift(recipe);
    try {
      localStorage.setItem(MY_RECIPES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Gagal menyimpan resep lokal", e);
    }
  },

  removeRecipeLocally(recipeId) {
    try {
      let favs = this.getFavorites().filter((item) => String(item.id) !== String(recipeId));
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));

      let my = this.getMyRecipes().filter((item) => String(item.id) !== String(recipeId));
      localStorage.setItem(MY_RECIPES_KEY, JSON.stringify(my));
    } catch (e) {
      console.warn("Gagal menghapus resep lokal", e);
    }
  },

  // --- GROCERIES / DAFTAR BELANJA ---
  getGroceries() {
    try {
      const data = localStorage.getItem(GROCERIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addGroceriesFromRecipe(recipeTitle, recipeId, ingredientsText) {
    if (!ingredientsText) return 0;
    const lines = String(ingredientsText)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) return 0;

    const list = this.getGroceries();
    let addedCount = 0;

    for (const line of lines) {
      const exists = list.some(
        (item) =>
          item.name.toLowerCase() === line.toLowerCase() &&
          item.recipe_title === recipeTitle
      );
      if (!exists) {
        list.push({
          id: "groc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
          name: line,
          completed: false,
          recipe_title: recipeTitle || "Resep",
          recipe_id: recipeId || null,
          created_at: new Date().toISOString(),
        });
        addedCount++;
      }
    }

    try {
      localStorage.setItem(GROCERIES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Gagal menyimpan daftar belanja", e);
    }
    return addedCount;
  },

  addCustomGrocery(name) {
    if (!name || !name.trim()) return null;
    const list = this.getGroceries();
    const newItem = {
      id: "groc-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      name: name.trim(),
      completed: false,
      recipe_title: "Belanja Tambahan",
      recipe_id: null,
      created_at: new Date().toISOString(),
    };
    list.unshift(newItem);
    try {
      localStorage.setItem(GROCERIES_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn("Gagal menyimpan belanja tambahan", e);
    }
    return newItem;
  },

  toggleGrocery(id) {
    const list = this.getGroceries();
    const updated = list.map((item) =>
      String(item.id) === String(id)
        ? { ...item, completed: !item.completed }
        : item
    );
    try {
      localStorage.setItem(GROCERIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal mengubah status belanja", e);
    }
    return updated;
  },

  removeGrocery(id) {
    const list = this.getGroceries();
    const updated = list.filter((item) => String(item.id) !== String(id));
    try {
      localStorage.setItem(GROCERIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal menghapus item belanja", e);
    }
    return updated;
  },

  clearCompletedGroceries() {
    const list = this.getGroceries();
    const updated = list.filter((item) => !item.completed);
    try {
      localStorage.setItem(GROCERIES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Gagal membersihkan belanjaan selesai", e);
    }
    return updated;
  },

  clearAllGroceries() {
    try {
      localStorage.removeItem(GROCERIES_KEY);
    } catch (e) {
      console.warn("Gagal menghapus semua belanjaan", e);
    }
    return [];
  },

  // --- USER PROFILE ---
  getProfile() {
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.avatar === "/logo.jpg") {
          parsed.avatar = "";
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return {
      name: "Chef Cookly",
      bio: "Pecinta kuliner nusantara dan hidangan sehat rumahan.",
      avatar: "",
    };
  },

  saveProfile(profile) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Gagal menyimpan profil", e);
    }
  },
};
