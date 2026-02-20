import { readFileSync, readdirSync, existsSync } from "fs";
import { execSync } from "child_process";
import { join, basename } from "path";

const WRITING_DIR = "src/pages/writing";
const DIST_DIR = "dist/writing";
const TEMPLATE_PATH = "scripts/password-template.html";

const password = process.env.STATICRYPT_PASSWORD;
if (!password) {
	console.log("STATICRYPT_PASSWORD not set, skipping encryption.");
	process.exit(0);
}

// Find MDX files with private: true in frontmatter
const mdxFiles = readdirSync(WRITING_DIR).filter((f) => f.endsWith(".mdx"));
const privateSlugs = [];

for (const file of mdxFiles) {
	const content = readFileSync(join(WRITING_DIR, file), "utf-8");
	const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
	if (frontmatterMatch && /^private:\s*true$/m.test(frontmatterMatch[1])) {
		const slug = basename(file, ".mdx");
		privateSlugs.push(slug);
	}
}

if (privateSlugs.length === 0) {
	console.log("No private posts found.");
	process.exit(0);
}

console.log(`Encrypting ${privateSlugs.length} private post(s): ${privateSlugs.join(", ")}`);

for (const slug of privateSlugs) {
	const htmlPath = join(DIST_DIR, slug, "index.html");

	if (!existsSync(htmlPath)) {
		console.error(`Built HTML not found: ${htmlPath}`);
		process.exit(1);
	}

	const outputDir = join(DIST_DIR, slug);
	execSync(
		`npx staticrypt "${htmlPath}" -p "${password}" -t "${TEMPLATE_PATH}" -d "${outputDir}" --short --template-title "What is my eye color?" --template-instructions " " --template-button "Unlock"`,
		{ stdio: "inherit" },
	);

	console.log(`Encrypted: ${htmlPath}`);
}

console.log("Done.");
