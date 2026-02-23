import { useState } from "react";
import { Toggle } from "./ThemeToggle";


export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    const toggleTheme = () => {
        // if previous theme is light, set to dark, else if its dark, set to light
        setTheme((prev => (prev === "light" ? "dark" : "light")));
    };

    return (
        <Toggle.Provider value={{ theme, toggleTheme }}>
            {children}
        </Toggle.Provider>
    )
}