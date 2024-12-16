import fs from "fs/promises";
import path from "path";

// Define the source folder containing the .jsx files
const sourceFolder = "./src/"; // Change this to your source folder path

// Define the target folder where .txt files will be saved
const targetFolder = "./documentation"; // Change this to your desired folder

// Ensure the target folder exists
async function ensureFolderExists(folder) {
  try {
    await fs.mkdir(folder, { recursive: true });
  } catch (err) {
    console.error(`Error creating folder ${folder}:`, err);
  }
}

// Function to convert .jsx files to .txt
async function convertJsxToTxt(source, target) {
  try {
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(
        target,
        entry.isFile() ? entry.name.replace(".jsx", ".txt") : entry.name
      );

      if (entry.isFile() && path.extname(entry.name) === ".jsx") {
        // Read .jsx file and write to .txt file
        const data = await fs.readFile(sourcePath, "utf8");
        await fs.writeFile(targetPath, data);
        console.log(`Converted: ${sourcePath} -> ${targetPath}`);
      } else if (entry.isDirectory()) {
        // Handle subdirectories
        await ensureFolderExists(targetPath);
        await convertJsxToTxt(sourcePath, targetPath);
      }
    }
  } catch (err) {
    console.error(`Error processing folder ${source}:`, err);
  }
}

// Function to recursively gather all .txt files from the documentation folder
async function gatherAllTxtFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await gatherAllTxtFiles(fullPath);
      files = files.concat(subFiles);
    } else if (
      entry.isFile() &&
      path.extname(entry.name) === ".txt" &&
      entry.name !== "documentationPages.txt"
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

// Combine all .txt files into one file called documentationPages.txt
async function combineTxtFiles(target) {
  const allTxtFiles = await gatherAllTxtFiles(target);
  let combinedContent = "";

  for (const file of allTxtFiles) {
    const content = await fs.readFile(file, "utf8");
    combinedContent += content + "\n"; // Add a newline between files
  }

  const combinedFilePath = path.join(target, "documentationPages.txt");
  await fs.writeFile(combinedFilePath, combinedContent, "utf8");
  console.log(`All .txt files combined into: ${combinedFilePath}`);
}

// Main function
async function main() {
  await ensureFolderExists(targetFolder);
  await convertJsxToTxt(sourceFolder, targetFolder);
  await combineTxtFiles(targetFolder);
}

main().catch((err) => console.error("Error:", err));
