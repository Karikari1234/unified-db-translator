"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface Translation {
  english: string;
  chinese: string;
}

export default function AdminTranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/translations');
        
        if (!response.ok) {
          throw new Error('Failed to fetch translations');
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Unknown error occurred');
        }
        
        // Convert the translations object to an array for display
        const englishToChinese = data.translations.english_to_chinese;
        const translationsArray = Object.keys(englishToChinese).map(english => ({
          english,
          chinese: englishToChinese[english]
        }));
        
        setTranslations(translationsArray);
        setError(null);
      } catch (error) {
        console.error('Error fetching translations:', error);
        setError('Failed to load translations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTranslations();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Translation Management</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl font-medium">Loading translations...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md text-red-600">
          {error}
        </div>
      ) : (
        <Card className="shadow-lg overflow-hidden p-6">
          <div className="mb-4">
            <h2 className="text-xl font-medium mb-2">Current Translations</h2>
            <p className="text-gray-500 text-sm mb-4">
              These translations are loaded from the server-side CSV file.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-b pb-2 mb-4">
            <div className="font-medium">English</div>
            <div className="font-medium">Chinese</div>
          </div>
          
          {translations.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 border-b py-2">
              <div>{item.english}</div>
              <div>{item.chinese}</div>
            </div>
          ))}
          
          <div className="mt-6 text-sm text-gray-500">
            <p>
              Note: This is a read-only view. Translations are stored in a secure CSV file on the server.
              To modify translations, please update the CSV file directly.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}