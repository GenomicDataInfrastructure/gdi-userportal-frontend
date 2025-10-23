const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Define guide sections and their paths
const guides = {
  "user-guide": {
    paths: ["docs/user-guide"],
    routes: [
      "user-guide",
      "get-started",
      "manage-datasets",
      "manage-organisations",
      "manage-roles",
      "manage-vocabularies",
    ],
  },
  "catalog-managers-guide": {
    paths: ["docs/catalog-managers-guide"],
    routes: ["catalog-managers-guide"],
  },
  "system-admin-guide": {
    paths: ["docs/system-admin-guide"],
    routes: [
      "system-admin-guide",
      "architecture-overview",
      "configure",
      "deploy",
      "set-up-authentication",
    ],
  },
  "developer-guide": {
    paths: ["docs/developer-guide"],
    routes: ["developer-guide", "set-up-a-developer-environment"],
  },
};

// Function to recursively get all .md files
function getAllMarkdownFiles(dir) {
  let files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files = files.concat(getAllMarkdownFiles(fullPath));
    } else if (item.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to extract text content from markdown
function extractTextContent(content) {
  // Remove frontmatter, code blocks, and markdown syntax
  return (
    content
      // Remove import statements
      .replace(/import\s+.*?from\s+['"][^'"]*['"];?\s*/g, "")
      // Remove code blocks first
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`[^`]*`/g, "")
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, "")
      // Remove JSX/React components
      .replace(/<[^>]*>/g, "")
      // Remove @site/src references
      .replace(/@site\/src\/[^\s]*/g, "")
      // Remove markdown headers but keep text
      .replace(/#{1,6}\s/g, "")
      // Remove bold/italic formatting but keep text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      // Remove links but keep text
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      // Remove images
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Replace newlines with spaces
      .replace(/\n+/g, " ")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

// Function to generate URL from file path
function generateUrl(filePath) {
  const relativePath = path
    .relative("docs", filePath)
    .replace(/\\/g, "/")
    .replace(/\.md$/, "")
    .replace(/\/index$/, "");

  // Ensure the URL starts with /gdi-userportal-frontend/ for GitHub Pages
  const baseUrl = "/gdi-userportal-frontend/";
  let url = "/" + relativePath;

  // If it's the main intro file, make it the root
  if (url === "/intro") {
    url = baseUrl + "intro";
  } else {
    url = baseUrl + relativePath;
  }

  return url;
}

// Generate search indexes
function generateSearchIndexes() {
  const indexes = {};

  for (const [guideName, guideConfig] of Object.entries(guides)) {
    console.log(`Generating index for ${guideName}...`);
    indexes[guideName] = [];

    // Get all markdown files for this guide
    for (const guidePath of guideConfig.paths) {
      const files = getAllMarkdownFiles(guidePath);

      for (const file of files) {
        try {
          const content = fs.readFileSync(file, "utf8");
          const { data: frontmatter, content: markdownContent } =
            matter(content);

          const url = generateUrl(file);
          const title =
            frontmatter.title || path.basename(file, ".md").replace(/-/g, " ");
          const textContent = extractTextContent(markdownContent);

          indexes[guideName].push({
            id: url,
            url: url,
            title: title,
            content: textContent,
            guide: guideName,
          });
        } catch (error) {
          console.error(`Error processing ${file}:`, error.message);
        }
      }
    }

    console.log(
      `Generated ${indexes[guideName].length} entries for ${guideName}`
    );
  }

  // Also create a combined index for homepage (all guides)
  indexes.all = [];
  for (const guideIndex of Object.values(indexes)) {
    if (Array.isArray(guideIndex)) {
      indexes.all = indexes.all.concat(guideIndex);
    }
  }

  console.log(
    `Generated ${indexes.all.length} total entries for combined index`
  );

  // Write indexes to static directory
  const outputDir = path.join(__dirname, "../static/search-indexes");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "search-indexes.json"),
    JSON.stringify(indexes, null, 2)
  );

  console.log("Search indexes generated successfully!");
  return indexes;
}

// Add gray-matter if not installed
try {
  require("gray-matter");
} catch (error) {
  console.error("gray-matter package not found. Installing...");
  const { execSync } = require("child_process");
  execSync("npm install gray-matter", { stdio: "inherit" });
}

// Run the generator
if (require.main === module) {
  generateSearchIndexes();
}

module.exports = { generateSearchIndexes };
