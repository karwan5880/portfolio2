import { useState } from "react";
import { useTheme } from "../hooks/useTheme";

const ThemeSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, changeTheme, getAllThemes, getThemeClasses } =
    useTheme();

  const themes = getAllThemes();
  const currentThemeConfig = themes.find((theme) => theme.key === currentTheme);

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${getThemeClasses("textMuted")} hover:${getThemeClasses(
          "text"
        )} transition-colors`}
        aria-label="Select theme"
      >
        <span className="text-lg">{currentThemeConfig?.icon}</span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Theme dropdown */}
          <div
            className={`absolute right-0 top-full mt-2 ${getThemeClasses(
              "card"
            )} border rounded-lg shadow-lg z-20 min-w-[120px]`}
          >
            <div className="p-2">
              <div
                className={`text-xs font-medium ${getThemeClasses(
                  "textMuted"
                )} px-2 py-1 mb-1`}
              >
                Themes
              </div>
              {themes.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => handleThemeChange(theme.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                    currentTheme === theme.key
                      ? getThemeClasses("button")
                      : `${getThemeClasses(
                          "textSecondary"
                        )} hover:${getThemeClasses("buttonSecondary")}`
                  }`}
                >
                  <span className="text-base">{theme.icon}</span>
                  <span>{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
