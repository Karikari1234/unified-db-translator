"use client";

interface AlternativeTranslation {
  text: string;
  translation: string;
}

interface AlternativeTranslationsProps {
  alternativeTranslations: AlternativeTranslation[];
}

export default function AlternativeTranslations({
  alternativeTranslations
}: AlternativeTranslationsProps) {
  if (!alternativeTranslations || alternativeTranslations.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-xs sm:text-sm text-muted-foreground mb-3">Other phrases</h3>
      
      <div className="space-y-3">
        {alternativeTranslations.map((item, index) => (
          <div key={index} className="border-b border-input pb-3 last:border-0">
            <p className="text-sm font-medium break-words">{item.text}</p>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">{item.translation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}