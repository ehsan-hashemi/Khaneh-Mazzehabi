import { Moon, Sun, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"fa" | "en" | "ar">("fa");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    const dir = language === "en" ? "ltr" : "rtl";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const changeLanguage = (lang: "fa" | "en" | "ar") => {
    setLanguage(lang);
    // Trigger Google Translate
    if (window.google && window.google.translate) {
      const langMap = { fa: "fa", en: "en", ar: "ar" };
      window.google.translate.TranslateElement?.({
        pageLanguage: "fa",
        includedLanguages: "fa,en,ar",
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo - Right side for RTL */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
            <span className="text-xl font-bold text-white">خ</span>
          </div>
          <span className="text-lg font-bold">خانه مضه‌حبی</span>
        </div>

        {/* Controls - Left side for RTL */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <Button
              variant={language === "fa" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("fa")}
              className="h-8 px-3 text-xs"
            >
              فارسی
            </Button>
            <Button
              variant={language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("en")}
              className="h-8 px-3 text-xs"
            >
              English
            </Button>
            <Button
              variant={language === "ar" ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage("ar")}
              className="h-8 px-3 text-xs"
            >
              عربي
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="hidden"></div>
    </header>
  );
};

export default Header;

// Extend Window interface for Google Translate
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}
