"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TranslatorOutputProps {
  targetLanguage: string;
  text: string;
}

export default function TranslatorOutput({
  targetLanguage,
  text
}: TranslatorOutputProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  // Format language name for display
  const formatLanguage = (language: string) => {
    return language.charAt(0).toUpperCase() + language.slice(1);
  };
  
  // Copy text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs sm:text-sm text-muted-foreground">Translate to</p>
        <p className="text-xs sm:text-sm font-medium">{formatLanguage(targetLanguage)}</p>
      </div>
      
      <div className="relative">
        <div className="w-full min-h-[100px] p-3 rounded-md border border-input bg-secondary/10 text-sm sm:text-base shadow-sm break-words">
          {text || <span className="text-muted-foreground">Translation will appear here</span>}
        </div>
        
        <div className="absolute bottom-2 right-2 flex space-x-1 sm:space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
            title="Listen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
            title="Save to phrasebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full ${isCopied ? 'text-primary' : ''}`}
            title={isCopied ? "Copied!" : "Copy translation"}
            onClick={handleCopy}
          >
            {isCopied ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
              </svg>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}