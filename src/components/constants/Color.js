
// College-specific colors
export const COLLEGE_COLORS = {
    KMIT: "#008080",
    KMCE: "#9966ff",
    NGIT: "#FF9F40",
    KMEC: "#36A2EB",
    "NGIT/KMEC": "#FF9F40",
};

// App-specific colors (for tools/apps)
export const APP_COLORS = {
    TESSELLATOR: "#A3BE8C",  // Warm: Sandy Orange
    BETAAL: "#6D9DC5",       // Cool: Steel Blue
    PRASHNAMANCH: "#F4A261", // Soothing: Lavender Pastel
    TOOFAAN: "#E76F51",      // Warm: Clay Red
    TECHTONIC: "#A8DADC",    // Cool/Soothing: Aqua Mint
    TANTRIK: "#FFDAC1",      // Soothing: Light Coral
    TESSERACT: "#88C0D0",    // Cool: Icy Blue
    GREENLENS: "#A3BE8C",    // Green: Soft Sage
};

export const COLLEGE_THEMES = {
    
    default: {
      primary: "from-slate-900 to-slate-700",
      secondary: "from-orange-50 to-orange-100",
      accent: "bg-slate-600",
      text: "text-orange-600",
      border: "border-orange-200",
      hover: "hover:from-orange-600 hover:to-orange-500",
      glow: "shadow-orange-500/20",
      card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    },
    kmit: {
      primary: `from-[${COLLEGE_COLORS.KMIT}] to-[${COLLEGE_COLORS.KMIT}]`, // Teal
      secondary: "from-teal-50 to-teal-100",
      accent: `bg-[${COLLEGE_COLORS.KMIT}]`, // Teal
      text: "text-teal-700",
      border: "border-teal-200",
      hover: "hover:from-teal-700 hover:to-teal-600",
      glow: "shadow-teal-500/20",
      card: "bg-teal-50/70 backdrop-blur-sm border-teal-200/50",
    },
    ngit: {
      primary: `from-[${COLLEGE_COLORS.NGIT}] to-[${COLLEGE_COLORS.NGIT}]`, // Orange
      secondary: "from-orange-50 to-orange-100",
      accent: `bg-[${COLLEGE_COLORS.NGIT}]`, // Orange
      text: "text-orange-600",
      border: "border-orange-200",
      hover: "hover:from-orange-600 hover:to-orange-500",
      glow: "shadow-orange-500/20",
      card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    },
    kmce: {
      primary: `from-[${COLLEGE_COLORS.KMCE}] to-[${COLLEGE_COLORS.KMCE}]`, // Purple
      secondary: "from-purple-50 to-purple-100",
      accent: `bg-[${COLLEGE_COLORS.KMCE}]`, // Purple
      text: "text-purple-600",
      border: "border-purple-200",
      hover: "hover:from-purple-700 hover:to-purple-600",
      glow: "shadow-purple-500/20",
      card: "bg-purple-50/70 backdrop-blur-sm border-purple-200/50",
    },
    kmec: {
      primary: `from-[${COLLEGE_COLORS.KMEC}] to-[${COLLEGE_COLORS.KMEC}]`, // Light Blue
      secondary: "from-blue-50 to-blue-100",
      accent: `bg-[${COLLEGE_COLORS.KMEC}]`, // Light Blue
      text: "text-blue-700",
      border: "border-blue-200",
      hover: "hover:from-blue-700 hover:to-blue-600",
      glow: "shadow-blue-500/20",
      card: "bg-blue-50/70 backdrop-blur-sm border-blue-200/50",
    },
    "NGIT/KMEC": {
      primary: `from-[${COLLEGE_COLORS["NGIT/KMEC"]}] to-[${COLLEGE_COLORS["NGIT/KMEC"]}]`, // Orange
      secondary: "from-orange-50 to-orange-100",
      accent: `bg-[${COLLEGE_COLORS["NGIT/KMEC"]}]`, // Orange
      text: "text-orange-600",
      border: "border-orange-200",
      hover: "hover:from-orange-600 hover:to-orange-500",
      glow: "shadow-orange-500/20",
      card: "bg-orange-50/70 backdrop-blur-sm border-orange-200/50",
    },
  };