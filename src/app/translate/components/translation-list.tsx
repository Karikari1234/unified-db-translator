import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TranslationListProps {
  translations: Record<string, string>;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  sourceLanguage?: string;
}

const TranslationList: React.FC<TranslationListProps> = ({
  translations,
  currentPage,
  itemsPerPage,
  onPageChange,
  sourceLanguage = "english",
}) => {
  // Convert translations object to array for easier pagination
  const translationItems = Object.entries(translations).map(
    ([source, target]) => ({
      chinese: sourceLanguage === "chinese" ? source : target,
      english: sourceLanguage === "chinese" ? target : source,
    })
  );

  // Calculate total pages
  const totalPages = Math.ceil(translationItems.length / itemsPerPage);

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = translationItems.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Maximum number of visible page links

    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust startPage if endPage is at max
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">All Translations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {currentItems.map((item, index) => (
          <Card
            key={index}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex flex-col">
                <div className="mb-2">
                  <span className="text-sm text-gray-500">Chinese</span>
                  <p className="text-lg font-medium">{item.chinese}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">English</span>
                  <p className="text-lg">{item.english}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="my-4">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(currentPage - 1)}
                />
              </PaginationItem>
            )}

            {getPageNumbers().map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-sm text-gray-500 text-center">
        Showing {startIndex + 1}-{Math.min(endIndex, translationItems.length)}{" "}
        of {translationItems.length} translations
      </div>
    </div>
  );
};

export default TranslationList;
