/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

// This is a server-side function that adds new translations to the CSV file
export async function POST(request: NextRequest) {
  try {
    // Only for demonstration - in a real app, you'd add proper authentication check here
    // This endpoint should be protected

    // Read the request body
    const body = await request.json();
    const { english, chinese } = body;

    if (!english || !chinese) {
      return NextResponse.json(
        {
          success: false,
          error: "Both English and Chinese translations are required",
        },
        { status: 400 }
      );
    }

    // Define the path to the CSV file
    const csvFilePath = path.join(
      process.cwd(),
      "src",
      "data",
      "translations",
      "translations.csv"
    );

    // Read the existing CSV file
    const fileContents = fs.readFileSync(csvFilePath, "utf8");

    // Parse the CSV data
    const parseResult = Papa.parse(fileContents, {
      header: true,
      skipEmptyLines: true,
    });

    const records = parseResult.data as any[];

    // Check if the translation already exists
    const exists = records.some(
      (record) => record.english === english || record.chinese === chinese
    );

    if (exists) {
      return NextResponse.json(
        {
          success: false,
          error: "Translation already exists",
        },
        { status: 409 }
      );
    }

    // Add the new translation
    records.push({ english, chinese });

    // Convert back to CSV
    const csv = Papa.unparse(records, { header: true });

    // Write back to the file
    fs.writeFileSync(csvFilePath, csv, "utf8");

    return NextResponse.json({
      success: true,
      message: "Translation added successfully",
    });
  } catch (error: any) {
    console.error("Error adding translation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
