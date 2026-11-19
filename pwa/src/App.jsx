import React, { useState, useEffect } from "react";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import HomeView from "./views/HomeView";
import RecipeDetailView from "./views/RecipeDetailView";
import AddRecipeView from "./views/AddRecipeView";
import ProfileView from "./views/ProfileView";
import GroceryListView from "./views/GroceryListView";
import { StorageService } from "./services/storage";

function getRouteFromUrl() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeParam = urlParams.get("recipe");
    if (recipeParam) {
      return { view: "detail", recipeId: recipeParam };
    }
    const viewParam = urlParams.get("view");
    if (viewParam && ["profile", "add", "explore", "grocery"].includes(viewParam)) {
      return { view: viewParam, recipeId: null };
    }
    const hash = window.location.hash;
    if (hash) {
      const match = hash.match(/recipe\/([^&/?]+)/) || hash.match(/recipe=([^&/?]+)/);
      if (match) {
        return { view: "detail", recipeId: match[1] };
      }
      if (hash.includes("grocery")) return { view: "grocery", recipeId: null };
      if (hash.includes("profile")) return { view: "profile", recipeId: null };
      if (hash.includes("add")) return { view: "add", recipeId: null };
    }
  } catch (e) {
    console.error("Error reading initial route:", e);
  }
  return { view: "home", recipeId: null };
}

export default function App() {
  const initialRoute = getRouteFromUrl();
  const [showSplash, setShowSplash] = useState(initialRoute.view === "home");
  const [currentView, setCurrentView] = useState(initialRoute.view); // "home" | "detail" | "add" | "profile" | "explore" | "grocery"
  const [selectedRecipeId, setSelectedRecipeId] = useState(initialRoute.recipeId);
  const [favorites, setFavorites] = useState([]);
  const [groceryCount, setGroceryCount] = useState(0);
  const [toast, setToast] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Keep document.title always as "Cookly"
  useEffect(() => {
    document.title = "Cookly";
  }, [currentView]);

  // Sync uncompleted groceries count
  const refreshGroceryCount = () => {
    try {
      const list = StorageService.getGroceries();
      const unbought = list.filter((g) => !g.completed).length;
      setGroceryCount(unbought);
    } catch {
      setGroceryCount(0);
    }
  };

  // Load initial data from localStorage
  useEffect(() => {
    setFavorites(StorageService.getFavorites());
    refreshGroceryCount();
  }, [currentView]);

  // Listen to browser Back/Forward navigation (Deep Linking & History)
  useEffect(() => {
    const handlePopState = () => {
      const route = getRouteFromUrl();
      setCurrentView(route.view);
      setSelectedRecipeId(route.recipeId);
      refreshGroceryCount();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Listen to PWA install prompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setToast({ type: "success", message: "Aplikasi Cookly berhasil dipasang!" });
    }
    setDeferredPrompt(null);
  };

  const handleToggleFavorite = (recipe) => {
    const isNowFavorite = StorageService.toggleFavorite(recipe);
    setFavorites(StorageService.getFavorites());
    setToast({
      type: "success",
      message: isNowFavorite
        ? `"${recipe.title}" ditambahkan ke favorit!`
        : `"${recipe.title}" dihapus dari favorit.`,
    });
  };

  const navigateTo = (view, recipeId = null) => {
    if (view === "detail" && recipeId) {
      setSelectedRecipeId(recipeId);
      setCurrentView("detail");
      window.history.pushState(null, "", `?recipe=${recipeId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      refreshGroceryCount();
      return;
    }

    // "explore" sets active state on Kategori and scrolls smoothly to Category selection section on Home
    if (view === "explore") {
      setCurrentView("explore");
      window.history.pushState(null, "", `?view=explore`);
      setTimeout(() => {
        const el = document.getElementById("section-kategori");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 60);
      refreshGroceryCount();
      return;
    }

    if (view === "home") {
      window.history.pushState(null, "", window.location.pathname);
    } else {
      window.history.pushState(null, "", `?view=${view}`);
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    refreshGroceryCount();
  };

  const isCurrentFavorite = selectedRecipeId
    ? favorites.some((f) => String(f.id) === String(selectedRecipeId))
    : false;

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col text-cookly-brown">
      {/* 1. Splash Screen on Initial App Load */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 2. Global Toast Notification (Centered at top) */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* 3. Top Navigation Bar (with circular logo & grocery badge) */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
        groceryCount={groceryCount}
      />

      {/* 4. Main Content Body - Centered & Proportionate */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {(currentView === "home" || currentView === "explore") && (
          <HomeView
            onSelectRecipe={(id) => navigateTo("detail", id)}
            onNavigate={(view) => navigateTo(view)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onShowToast={setToast}
          />
        )}

        {currentView === "detail" && selectedRecipeId && (
          <RecipeDetailView
            recipeId={selectedRecipeId}
            onBack={() => navigateTo("home")}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavorite}
            onShowToast={(t) => {
              setToast(t);
              refreshGroceryCount();
            }}
          />
        )}

        {currentView === "add" && (
          <AddRecipeView
            onBack={() => navigateTo("home")}
            onRecipeCreated={(newId) => navigateTo("detail", newId)}
            onShowToast={setToast}
          />
        )}

        {currentView === "grocery" && (
          <GroceryListView
            onNavigate={(view, id) => navigateTo(view, id)}
            onShowToast={(t) => {
              setToast(t);
              refreshGroceryCount();
            }}
          />
        )}

        {currentView === "profile" && (
          <ProfileView
            favorites={favorites}
            onSelectRecipe={(id) => navigateTo("detail", id)}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={(view) => navigateTo(view)}
            onShowToast={setToast}
            deferredPrompt={deferredPrompt}
            onInstallPwa={handleInstallPwa}
          />
        )}
      </main>

      {/* 5. Mobile Bottom Navigation Bar (5 Tabs) */}
      <BottomNav
        currentView={currentView}
        onNavigate={(view) => navigateTo(view)}
        groceryCount={groceryCount}
      />
    </div>
  );
}
