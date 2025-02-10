export const colors = {
    primary: "#025c4a", // Deep green (Main brand color)
    secondary: "#36BA98", // Almost black (Best for contrast)
    accent: "#F3E5AB", // Vanilla (Soft & warm highlight)
    light: "#E3FCEF", // Pale green (Subtle backgrounds)
    dark: "#01382F", // Darker green (For deep elements)
    white: "#FFFFFF", // Pure white (Text & contrast)
    gray: "#8E8E8E", // Neutral tone (For disabled or less emphasis)
    danger : "#fc1943", // Red (For warnings or errors)
};

export const buttonStyles = {
    primary: {
        backgroundColor: colors.primary,
        color: colors.white,
    },
    secondary: {
        backgroundColor: colors.secondary,
        color: colors.white,
    },
    success: {
        backgroundColor: colors.light,
        color: colors.primary,
    },
    disabled: {
        backgroundColor: colors.gray,
        color: colors.secondary,
    },
};

export const backgroundColors = {
    dark: colors.secondary, // Best for dark themes
    light: colors.light, // Soft pastel-like background
    card: colors.dark, // Slightly deeper contrast for components
};

export const borderColor = {
    dark: colors.secondary, // Best for dark themes
    light: colors.light, // Soft pastel-like background
    card: colors.dark, // Slightly deeper contrast for components
};
export const textColors = {
    primary: colors.white,
    secondary: colors.secondary,
    highlight: colors.accent,
    dark: colors.secondary,
    light: colors.light,
    gray: colors.gray,
    
};
