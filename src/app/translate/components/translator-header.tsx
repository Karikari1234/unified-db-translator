"use client";

import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";
import { supportedLanguages } from "../utils/translations";

interface TranslatorHeaderProps {
  sourceLanguage: string;
  targetLanguage: string;
  onSwapLanguages: () => void;
  onSourceLanguageChange: (language: string) => void;
  onTargetLanguageChange: (language: string) => void;
}

export default function TranslatorHeader({
  sourceLanguage,
  targetLanguage,
  onSwapLanguages,
  onSourceLanguageChange,
  onTargetLanguageChange
}: TranslatorHeaderProps) {
  
  // Format language name for display
  const formatLanguage = (languageCode: string) => {
    const language = supportedLanguages.find(lang => lang.code === languageCode);
    return language ? language.name : languageCode.charAt(0).toUpperCase() + languageCode.slice(1);
  };
  
  return (
    <CardHeader className="bg-primary/90 text-primary-foreground p-4">
      <div className="flex items-center justify-between">
        {/* Source language selector */}
        <div className="relative">
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground flex items-center gap-1 font-medium"
            onClick={() => onSourceLanguageChange(sourceLanguage === "english" ? "chinese" : "english")}
          >
            {formatLanguage(sourceLanguage)}
            <span className="ml-1">▼</span>
          </Button>
        </div>
        
        {/* Swap languages button */}
        <Button
          variant="ghost"
          className="text-primary-foreground hover:bg-primary/80 rounded-full p-2 flex-shrink-0 mx-2"
          onClick={onSwapLanguages}
          aria-label="Swap languages"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-90 sm:rotate-0">
            <path d="M7 17l-5-5 5-5M17 7l5 5-5 5"/>
            <path d="M12 19V5"/>
          </svg>
        </Button>
        
        {/* Target language selector */}
        <div className="relative">
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground flex items-center gap-1 font-medium"
            onClick={() => onTargetLanguageChange(targetLanguage === "english" ? "chinese" : "english")}
          >
            {formatLanguage(targetLanguage)}
            <span className="ml-1">▼</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}