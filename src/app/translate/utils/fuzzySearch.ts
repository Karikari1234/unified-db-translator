import Fuse from 'fuse.js';

// Interface for translation items
export interface TranslationItem {
  text: string;
  translation: string;
}

// Create a search index for either English or Chinese phrases
export function createSearchIndex(
  translations: Record<string, string>,
  sourceLanguage: string
): Fuse<TranslationItem> {
  // Convert the translations dictionary to an array of items
  const items: TranslationItem[] = Object.entries(translations).map(([key, value]) => ({
    text: key,
    translation: value,
  }));

  // Configure Fuse.js options
  const options = {
    includeScore: true,
    threshold: 0.4, // Lower values are more strict
    keys: ['text'],
  };

  // Create and return the Fuse instance
  return new Fuse(items, options);
}

// Find suggestions based on input text
export function findSuggestions(
  searchIndex: Fuse<TranslationItem> | null,
  inputText: string,
  limit: number = 5
): TranslationItem[] {
  if (!searchIndex || !inputText) {
    return [];
  }

  // Perform the search
  const results = searchIndex.search(inputText);

  // Return the top matches
  return results.slice(0, limit).map((result) => result.item);
}
