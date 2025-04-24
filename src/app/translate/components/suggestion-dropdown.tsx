"use client";

import { TranslationItem } from "../utils/fuzzySearch";

interface SuggestionDropdownProps {
  suggestions: TranslationItem[];
  isVisible: boolean;
  onSelect: (suggestion: TranslationItem) => void;
  highlightedIndex: number;
}

export default function SuggestionDropdown({
  suggestions,
  isVisible,
  onSelect,
  highlightedIndex,
}: SuggestionDropdownProps) {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
              index === highlightedIndex ? "bg-gray-100" : ""
            }`}
            onClick={() => onSelect(suggestion)}
          >
            <div className="font-medium">{suggestion.text}</div>
            <div className="text-sm text-gray-500">{suggestion.translation}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
