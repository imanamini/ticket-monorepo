const { visualizer } = require("esbuild-visualizer");
const fs = require("fs");
const path = require("path");

async function generateAnalysis() {
  try {
    const metafilePath = "dist/analyze/dpx/meta.json";
    const outputPath = "dist/analyze/dpx/bundle-visualizer.html";

    if (!fs.existsSync(metafilePath)) {
      console.error("❌ Metafile not found at:", metafilePath);
      process.exit(1);
    }

    console.log("🔍 Reading metafile...");
    const metafile = JSON.parse(fs.readFileSync(metafilePath, 'utf8'));

    console.log("🔍 Generating bundle analysis...");
    const html = await visualizer(metafile, {
      template: "treemap",
      gzip: true,
      brotli: true,
    });

    fs.writeFileSync(outputPath, html);
    console.log("📊 Bundle analysis report generated successfully!");
    console.log("   File: " + outputPath);

    const stats = fs.statSync(outputPath);
    console.log("   Size: " + stats.size + " bytes");
  } catch (error) {
    console.error("❌ Failed to generate bundle analysis:", error);
    process.exit(1);
  }
}

generateAnalysis();
