"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Palette } from "lucide-react";

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { name: "Dark+", value: "custom-dark", icon: <Moon className="h-4 w-4" /> },
  { name: "Light+", value: "custom-light", icon: <Sun className="h-4 w-4" /> },
  { name: "Dracula", value: "dracula", icon: <Palette className="h-4 w-4" /> },
  { name: "Monokai", value: "monokai", icon: <Palette className="h-4 w-4" /> },
  {
    name: "GitHub Dark",
    value: "github-dark",
    icon: <Palette className="h-4 w-4" />,
  },
];

export function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  const selectedTheme =
    themes.find((t) => t.value === currentTheme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          {selectedTheme.icon}
          <span className="ml-2 hidden md:inline">{selectedTheme.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className="flex items-center gap-2"
          >
            {theme.icon}
            <span>{theme.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
