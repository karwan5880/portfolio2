export const THEMES = {
  DARK: "dark",
  LIGHT: "light",
  BLUE: "blue",
  GREEN: "green",
  PURPLE: "purple",
};

export const THEME_CONFIG = {
  [THEMES.DARK]: {
    name: "Dark",
    icon: "🌙",
    classes: {
      body: "bg-gray-900 text-white",
      header: "bg-gray-800 border-gray-700",
      card: "bg-gray-800 border-gray-700",
      input:
        "bg-gray-700 border-gray-600 text-gray-300 placeholder:text-gray-500 focus:bg-gray-800",
      button: "bg-gray-600 hover:bg-gray-500 text-white",
      buttonSecondary: "bg-gray-700 hover:bg-gray-600 text-gray-300",
      text: "text-white",
      textMuted: "text-gray-400",
      textSecondary: "text-gray-300",
    },
  },
  [THEMES.LIGHT]: {
    name: "Light",
    icon: "☀️",
    classes: {
      body: "bg-gray-50 text-gray-900",
      header: "bg-white border-gray-200",
      card: "bg-white border-gray-200",
      input:
        "bg-gray-50 border-gray-200 text-gray-700 placeholder:text-gray-400 focus:bg-white",
      button: "bg-gray-700 hover:bg-gray-800 text-white",
      buttonSecondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
      text: "text-gray-900",
      textMuted: "text-gray-500",
      textSecondary: "text-gray-600",
    },
  },
  [THEMES.BLUE]: {
    name: "Ocean",
    icon: "🌊",
    classes: {
      body: "bg-blue-900 text-blue-50",
      header: "bg-blue-800 border-blue-700",
      card: "bg-blue-800 border-blue-700",
      input:
        "bg-blue-700 border-blue-600 text-blue-100 placeholder:text-blue-300 focus:bg-blue-600",
      button: "bg-blue-600 hover:bg-blue-500 text-white",
      buttonSecondary: "bg-blue-700 hover:bg-blue-600 text-blue-200",
      text: "text-blue-50",
      textMuted: "text-blue-300",
      textSecondary: "text-blue-200",
    },
  },
  [THEMES.GREEN]: {
    name: "Forest",
    icon: "🌲",
    classes: {
      body: "bg-green-900 text-green-50",
      header: "bg-green-800 border-green-700",
      card: "bg-green-800 border-green-700",
      input:
        "bg-green-700 border-green-600 text-green-100 placeholder:text-green-300 focus:bg-green-600",
      button: "bg-green-600 hover:bg-green-500 text-white",
      buttonSecondary: "bg-green-700 hover:bg-green-600 text-green-200",
      text: "text-green-50",
      textMuted: "text-green-300",
      textSecondary: "text-green-200",
    },
  },
  [THEMES.PURPLE]: {
    name: "Cosmic",
    icon: "🌌",
    classes: {
      body: "bg-purple-900 text-purple-50",
      header: "bg-purple-800 border-purple-700",
      card: "bg-purple-800 border-purple-700",
      input:
        "bg-purple-700 border-purple-600 text-purple-100 placeholder:text-purple-300 focus:bg-purple-600",
      button: "bg-purple-600 hover:bg-purple-500 text-white",
      buttonSecondary: "bg-purple-700 hover:bg-purple-600 text-purple-200",
      text: "text-purple-50",
      textMuted: "text-purple-300",
      textSecondary: "text-purple-200",
    },
  },
};

export const DEFAULT_THEME = THEMES.DARK;
