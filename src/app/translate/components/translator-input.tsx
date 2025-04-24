"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { TranslationItem } from "../utils/fuzzySearch";
import SuggestionDropdown from "./suggestion-dropdown";

interface TranslatorInputProps {
  sourceLanguage: string;
  text: string;
  onChange: (value: string) => void;
  suggestions: TranslationItem[];
  onSuggestionSelect: (suggestion: TranslationItem) => void;
}

export default function TranslatorInput({
  sourceLanguage,
  text,
  onChange,
  suggestions,
  onSuggestionSelect
}: TranslatorInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // If no suggestions or not showing suggestions, do nothing
    if (!suggestions.length || !showSuggestions) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          onSuggestionSelect(suggestions[highlightedIndex]);
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Show suggestions when input is focused and has content
  useEffect(() => {
    setShowSuggestions(isFocused && text.length > 0 && suggestions.length > 0);
    setHighlightedIndex(-1); // Reset highlighted index when suggestions change
  }, [isFocused, text, suggestions]);
  
  // Format language name for display
  const formatLanguage = (language: string) => {
    return language.charAt(0).toUpperCase() + language.slice(1);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs sm:text-sm text-muted-foreground">Translate from</p>
        <p className="text-xs sm:text-sm font-medium">{formatLanguage(sourceLanguage)}</p>
      </div>
      
      <div className={`relative border rounded-md transition-colors ${isFocused ? 'border-primary ring-1 ring-primary' : 'border-input'}`}>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow suggestion clicks
          onKeyDown={handleKeyDown}
          className="w-full min-h-[100px] p-3 bg-transparent text-sm sm:text-base focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          placeholder={`Enter text in ${sourceLanguage}`}
        />
        
        <SuggestionDropdown
          suggestions={suggestions}
          isVisible={showSuggestions}
          onSelect={(suggestion) => {
            onSuggestionSelect(suggestion);
            setShowSuggestions(false);
          }}
          highlightedIndex={highlightedIndex}
        />
        
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
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
            title="Copy text"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
            </svg>
          </Button>
        </div>
      </div>
      
      {suggestions.length > 0 && text.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          {suggestions.length} suggestion{suggestions.length !== 1 ? 's' : ''} available. Use up/down arrows to navigate.
        </div>
      )}
    </div>
  );
}