import { createContext } from "react";

type ThemeToggleType = {
    theme: "light" | "dark";
    toggleTheme: () => void;
};

export const Toggle = createContext<ThemeToggleType>({
   theme: "light",
   toggleTheme: () => {}
});