/* eslint-disable */
"use client";

import { useState, useEffect, useMemo } from "react";
import TranslatorHeader from "./components/translator-header";
import TranslatorInput from "./components/translator-input";
import TranslatorOutput from "./components/translator-output";
import AlternativeTranslations from "./components/alternative-translations";
import TranslationList from "./components/translation-list";
import { Card } from "@/components/ui/card";
import {
  dummyTranslations,
  alternativeTranslations,
  fetchTranslations,
} from "./utils/translations";
import { createSearchIndex, findSuggestions, TranslationItem } from "./utils/fuzzySearch";
import useDebounce from "@/hooks/useDebounce";

export default function TranslatePage() {
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("chinese");
  const [inputText, setInputText] = useState("How are you?");
  const [outputText, setOutputText] = useState("你好吗？");
  const [currentAlternatives, setCurrentAlternatives] = useState(
    alternativeTranslations["How are you?"]
  );
  const [translations, setTranslations] = useState(dummyTranslations);
  const [alternatives, setAlternatives] = useState(alternativeTranslations);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<TranslationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Number of items per pagination page
  
  // Debounce the input text to prevent excessive searches
  const debouncedInputText = useDebounce(inputText, 300);
  
  // Create search indices based on current translations
  const englishSearchIndex = useMemo(() => 
    createSearchIndex(translations.english_to_chinese, 'english')
  , [translations]);
  
  const chineseSearchIndex = useMemo(() => 
    createSearchIndex(translations.chinese_to_english, 'chinese')
  , [translations]);

  // Load translations from server on component mount
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const {
          translations: fetchedTranslations,
          alternatives: fetchedAlternatives,
        } = await fetchTranslations();
        setTranslations(fetchedTranslations);
        setAlternatives(fetchedAlternatives);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to dummy translations (already set as initial state)
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  // Update translation when input text or languages change
  useEffect(() => {
    updateTranslation(inputText);
  }, [inputText, sourceLanguage, targetLanguage, translations, alternatives]);
  
  // Update suggestions when debounced input text changes
  useEffect(() => {
    if (debouncedInputText.trim().length > 0) {
      const searchIndex = sourceLanguage === "english" ? englishSearchIndex : chineseSearchIndex;
      const newSuggestions = findSuggestions(searchIndex, debouncedInputText, 5);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [debouncedInputText, sourceLanguage, englishSearchIndex, chineseSearchIndex]);

  // Function to get translation based on current languages
  const updateTranslation = (text: string) => {
    const translationMap =
      sourceLanguage === "english"
        ? translations.english_to_chinese
        : translations.chinese_to_english;

    const translated =
      translationMap[text as keyof typeof translationMap] || "";
    setOutputText(translated);

    // Update alternative translations if available
    if (alternatives[text as keyof typeof alternatives]) {
      setCurrentAlternatives(alternatives[text as keyof typeof alternatives]);
    } else {
      setCurrentAlternatives([]);
    }
  };

  // Swap languages function
  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setInputText(outputText);
    updateTranslation(outputText);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputText(value);
    // Suggestions will be updated by the debounced effect
  };
  
  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: TranslationItem) => {
    setInputText(suggestion.text);
    updateTranslation(suggestion.text);
  };

  // Handle source language change
  const handleSourceLanguageChange = (language: string) => {
    setSourceLanguage(language);
  };

  // Handle target language change
  const handleTargetLanguageChange = (language: string) => {
    setTargetLanguage(language);
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to translation list
    const translationListElement = document.getElementById('translation-list');
    if (translationListElement) {
      translationListElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-medium">Loading translations...</div>
        </div>
      ) : (
        <>
          <Card className="shadow-lg overflow-hidden mb-8">
            <TranslatorHeader
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              onSwapLanguages={handleSwapLanguages}
              onSourceLanguageChange={handleSourceLanguageChange}
              onTargetLanguageChange={handleTargetLanguageChange}
            />

            <div className="p-4 md:p-6">
              <TranslatorInput
                sourceLanguage={sourceLanguage}
                text={inputText}
                onChange={handleInputChange}
                suggestions={suggestions}
                onSuggestionSelect={handleSuggestionSelect}
              />

              <TranslatorOutput
                targetLanguage={targetLanguage}
                text={outputText}
              />

              {currentAlternatives && currentAlternatives.length > 0 && (
                <AlternativeTranslations
                  alternativeTranslations={currentAlternatives}
                />
              )}
            </div>
          </Card>
          
          <div id="translation-list">
            <TranslationList 
              translations={sourceLanguage === "chinese" ? translations.chinese_to_english : translations.english_to_chinese}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              sourceLanguage={sourceLanguage}
            />
          </div>
        </>
      )}
    </div>
  );
}
