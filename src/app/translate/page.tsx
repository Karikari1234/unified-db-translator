"use client";

import { useState, useEffect } from "react";
import TranslatorHeader from "./components/translator-header";
import TranslatorInput from "./components/translator-input";
import TranslatorOutput from "./components/translator-output";
import AlternativeTranslations from "./components/alternative-translations";
import { Card } from "@/components/ui/card";
import { dummyTranslations, alternativeTranslations } from "./utils/translations";

export default function TranslatePage() {
  const [sourceLanguage, setSourceLanguage] = useState("english");
  const [targetLanguage, setTargetLanguage] = useState("chinese");
  const [inputText, setInputText] = useState("How are you?");
  const [outputText, setOutputText] = useState("你好吗？");
  const [currentAlternatives, setCurrentAlternatives] = useState(alternativeTranslations["How are you?"]);
  
  // Update translation when input text or languages change
  useEffect(() => {
    updateTranslation(inputText);
  }, [inputText, sourceLanguage, targetLanguage]);
  
  // Function to get translation based on current languages
  const updateTranslation = (text: string) => {
    const translationMap = 
      sourceLanguage === "english" ? dummyTranslations.english_to_chinese : dummyTranslations.chinese_to_english;
    
    const translated = translationMap[text as keyof typeof translationMap] || "";
    setOutputText(translated);
    
    // Update alternative translations if available
    if (alternativeTranslations[text as keyof typeof alternativeTranslations]) {
      setCurrentAlternatives(alternativeTranslations[text as keyof typeof alternativeTranslations]);
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
  };
  
  // Handle source language change
  const handleSourceLanguageChange = (language: string) => {
    setSourceLanguage(language);
  };
  
  // Handle target language change
  const handleTargetLanguageChange = (language: string) => {
    setTargetLanguage(language);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Card className="shadow-lg overflow-hidden">
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
    </div>
  );
}