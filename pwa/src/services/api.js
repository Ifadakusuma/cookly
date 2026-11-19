const API_BASE = import.meta.env.VITE_API_URL || "/api";

export function generateClientId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Gagal memuat kategori");
  return res.json();
}

export async function fetchRecipes({ search = "", categoryId = "" } = {}) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (categoryId) params.append("category_id", categoryId);

  const url = `${API_BASE}/recipes${params.toString() ? `?${params.toString()}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Gagal memuat resep");
  return res.json();
}

export async function fetchRecipeById(id) {
  const res = await fetch(`${API_BASE}/recipes/${id}`);
  if (!res.ok) throw new Error("Resep tidak ditemukan");
  return res.json();
}

export async function createRecipe(data) {
  const res = await fetch(`${API_BASE}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Gagal menambahkan resep");
  }
  return body;
}

export async function updateRecipe(id, data) {
  const res = await fetch(`${API_BASE}/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Gagal memperbarui resep");
  }
  return body;
}

export async function deleteRecipe(id) {
  const res = await fetch(`${API_BASE}/recipes/${id}`, {
    method: "DELETE",
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Gagal menghapus resep");
  }
  return body;
}

export async function fetchReviews(recipeId) {
  const res = await fetch(`${API_BASE}/recipes/${recipeId}/reviews`);
  if (!res.ok) throw new Error("Gagal memuat ulasan");
  return res.json();
}

export async function createReview(recipeId, { reviewer_name, rating, comment, client_id }) {
  const res = await fetch(`${API_BASE}/recipes/${recipeId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reviewer_name, rating, comment, client_id }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Gagal mengirim ulasan");
  }
  return body;
}

export async function uploadRecipeImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || "Gagal mengunggah gambar");
  }
  return body.url;
}
