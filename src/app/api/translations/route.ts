/* eslint-disable */
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

// Define proper interfaces for type safety
interface TranslationRecord {
  english: string;
  chinese: string;
  [key: string]: string; // Allow for additional fields
}

interface TranslationMap {
  [key: string]: string;
}

interface TranslationsObject {
  english_to_chinese: TranslationMap;
  chinese_to_english: TranslationMap;
}

interface AlternativeTranslation {
  text: string;
  translation: string;
}

// This is a server-side function that reads the CSV file and processes it
export async function GET() {
  try {
    // Define the path to the CSV file - this is on the server side, not accessible to clients
    const csvFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "translations",
      "translations.csv"
    );

    // Read the CSV file
    const fileContents = fs.readFileSync(csvFilePath, "utf8");

    // Parse the CSV data
    const parseResult = Papa.parse(fileContents, {
      header: true, // Use the first row as column names
      skipEmptyLines: true,
    });

    const records = parseResult.data;

    // Create the translation objects with the format needed by the application
    const translations: TranslationsObject = {
      english_to_chinese: {},
      chinese_to_english: {},
    };

    // Generate alternative translations (empty for now - could be enhanced later)
    const alternatives: Record<string, AlternativeTranslation[]> = {};

    // Convert the records to the format needed by the application
    (records as any[]).forEach((record: TranslationRecord) => {
      if (record.english && record.chinese) {
        // Add to english_to_chinese mapping
        translations.english_to_chinese[record.english] = record.chinese;

        // Add to chinese_to_english mapping
        translations.chinese_to_english[record.chinese] = record.english;

        // Create empty alternatives for some phrases (could be enhanced later)
        if (["How are you?", "Hello", "Thank you"].includes(record.english)) {
          alternatives[record.english] = [
            { text: record.chinese, translation: record.english },
          ];
        }
      }
    });

    // Return the processed translations
    return NextResponse.json({
      success: true,
      translations,
      alternatives,
    });
  } catch (error: any) {
    console.error("Error processing translations:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
