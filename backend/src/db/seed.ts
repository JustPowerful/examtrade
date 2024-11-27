import { db } from ".";
import Papa from "papaparse";
import { institutesTable } from "./schema";

function main() {
  const filePath = __dirname + "/seeding_source/etablissements.csv";

  const csvFile = Bun.file(filePath);
  csvFile.text().then((csvText) => {
    Papa.parse(csvText, {
      header: true,
      complete: async (
        results: Papa.ParseResult<{
          label_fr: string;
          gouvernorat: string;
          website: string;
        }>
      ) => {
        const data = results.data;
        for (let record of data) {
          if (record.label_fr) {
            await db.insert(institutesTable).values({
              name: record.label_fr,
              gouvernorate: record.gouvernorat,
              city: record.gouvernorat,
              website: record.website,
            });
          }
        }
        console.log("✨ Institute Seeding completed.");
      },
      error: (error: any) => {
        console.error("Error parsing CSV:", error);
      },
    });
  });
}

main();
