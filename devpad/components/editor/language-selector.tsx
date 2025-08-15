"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Code2 } from "lucide-react";

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string, extension: string) => void;
}

const languages = [
  { name: "HTML", value: "html", extension: "html", icon: "🌐" },
  { name: "CSS", value: "css", extension: "css", icon: "🎨" },
  { name: "JavaScript", value: "javascript", extension: "js", icon: "⚡" },
  { name: "TypeScript", value: "typescript", extension: "ts", icon: "📘" },
  { name: "Python", value: "python", extension: "py", icon: "🐍" },
  { name: "Java", value: "java", extension: "java", icon: "☕" },
  { name: "C++", value: "cpp", extension: "cpp", icon: "⚙️" },
  { name: "C", value: "c", extension: "c", icon: "🔧" },
  { name: "JSON", value: "json", extension: "json", icon: "📋" },
];

export function LanguageSelector({
  currentLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  const currentLang =
    languages.find((lang) => lang.value === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
          <Code2 className="h-3 w-3 mr-1" />
          <span className="mr-1">{currentLang.icon}</span>
          {currentLang.name}
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.value}
            onClick={() => onLanguageChange(language.value, language.extension)}
            className="flex items-center gap-2"
          >
            <span>{language.icon}</span>
            <span>{language.name}</span>
            <span className="text-xs text-muted-foreground ml-auto">
              .{language.extension}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
