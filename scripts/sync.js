import fs from 'fs-extra';
import path from 'path';
import matter from 'gray-matter';
import { glob } from 'glob';

const SOURCE_A_DIR = 'data/source_a'; // Upstream (Git ignored usually)
const SOURCE_B_DIR = 'data/source_b'; // Local fixed
const OUTPUT_DIR = 'src/content/quotes';
const MANIFEST_FILE = 'public/api/index-min.json';

async function sync() {
  console.log('Starting sync...');

  // 1. Clean output
  await fs.emptyDir(OUTPUT_DIR);
  await fs.ensureDir(OUTPUT_DIR);
  await fs.ensureDir(path.dirname(MANIFEST_FILE));

  const quotes = [];

  // 2. Gather files from sources
  const sources = [SOURCE_B_DIR, SOURCE_A_DIR];
  
  for (const sourceDir of sources) {
    if (!fs.existsSync(sourceDir)) {
      console.log(`Source directory ${sourceDir} not found, skipping.`);
      continue;
    }

    const files = await glob('**/*.md', { cwd: sourceDir });
    
    for (const file of files) {
      const srcPath = path.join(sourceDir, file);
      const content = await fs.readFile(srcPath, 'utf-8');
      const parsed = matter(content);
      
      // Basic Validation
      if (!parsed.data.title && !parsed.data.content) { 
        console.warn(`Skipping ${file}: No title found.`);
        continue;
      }

      // Generate a standardized ID/Slug
      const filename = path.basename(file, '.md');
      const slug = filename; // Use filename as slug for simplicity and permalinks
      
      // Destination Path
      const destPath = path.join(OUTPUT_DIR, `${slug}.md`);
      
      // We write the file to src/content/quotes so Astro Content Collections can pick it up
      // We can preserve the original frontmatter and content
      await fs.copy(srcPath, destPath);
      // // We avoid 'layout' key to prevent Astro trying to resolve it as a component
      // const data = { ...parsed.data };
      // delete data.layout;
      
      // const newContent = matter.stringify(parsed.content, data);
      // await fs.writeFile(destPath, newContent);

      // Add to Manifest
      quotes.push({
        id: slug,
        title: parsed.data.title, // The quote itself
        author: parsed.data.author,
        source: parsed.data.source,
        path: `/quote/${slug}`
      });
    }
  }

  // 3. Write Manifest
  await fs.writeJSON(MANIFEST_FILE, quotes);
  console.log(`Sync complete. Processed ${quotes.length} quotes.`);
}

sync().catch(console.error);
