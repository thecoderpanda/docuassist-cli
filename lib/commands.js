const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const OpenAI = require('openai');
const fse = require('fs-extra');

const DOCUSAURUS_CONFIG_PATH = 'docusaurus.config.js';

function CheckTest() {
    console.log('Docuassist CLI is working!')
    process.exit(1)
}
function checkDocusaurusInstallation() {
  if (!fs.existsSync(DOCUSAURUS_CONFIG_PATH)) {
    console.error('Error: Docusaurus configuration file not found.');
    process.exit(1);
  }
}

function installPlugin() {
  try {
    execSync('npm install docusaurus-docuassist');
    console.log('docusaurus-docuassist installed successfully.');
  } catch (error) {
    console.error('Error installing docusaurus-docuassist:', error);
    process.exit(1);
  }
}

function updateDocusaurusConfig() {
  const configPath = path.resolve(DOCUSAURUS_CONFIG_PATH);
  const configContent = fs.readFileSync(configPath, 'utf-8');

  if (!configContent.includes('docusaurus-docuassist')) {
    const newConfigContent = configContent.replace(
      /(plugins\s*:\s*\[)/,
      `$1\n    [\n      'docusaurus-docuassist',\n      {\n        DocsDir: './docs',\n        openAiKey: 'YOUR_OPENAI_API_KEY',\n        openAiAssistantId: 'YOUR_OPENAI_ASSISTANT_ID',\n      },\n    ],`
    );
    fs.writeFileSync(configPath, newConfigContent, 'utf-8');
    console.log('docusaurus.config.js updated successfully.');
  } else {
    console.log('docusaurus-docuassist is already configured in docusaurus.config.js.');
  }
}

function initPlugin() {
  checkDocusaurusInstallation();
  installPlugin();
  updateDocusaurusConfig();
}

async function ingestDocs() {
  checkDocusaurusInstallation();

  const configPath = path.resolve(DOCUSAURUS_CONFIG_PATH);
  const configContent = require(configPath);

  const docsDir = configContent.plugins.find(plugin => plugin[0] === 'docusaurus-docuassist')[1].DocsDir;
  const openAiKey = process.env.OPENAI_API_KEY || configContent.customFields.openAiKey;
  const openAiAssistantId = process.env.OPENAI_ASSISTANT_ID || configContent.customFields.openAiAssistantId;

  const openai = new OpenAI({ apiKey: openAiKey });

  let vectorStore = [];
  try {
    const response = await openai.Vectors.list({ assistant_id: openAiAssistantId });
    vectorStore = response.data;
  } catch (error) {
    console.error('Error fetching vector store:', error);
    process.exit(1);
  }

  const docsPath = path.resolve(docsDir);
  if (!fs.existsSync(docsPath)) {
    console.error(`The specified "docsDir" does not exist: ${docsPath}`);
    process.exit(1);
  }

  const files = fs.readdirSync(docsPath).filter(file => file.endsWith('.md') || file.endsWith('.mdx'));

  for (const file of files) {
    const filePath = path.join(docsPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    const exists = vectorStore.some(vector => vector.metadata.fileName === file);
    if (!exists) {
      try {
        await openai.Vectors.create({
          assistant_id: openAiAssistantId,
          input: fileContent,
          metadata: { fileName: file },
        });
        console.log(`File "${file}" added to vector store.`);
      } catch (error) {
        console.error(`Error adding file "${file}" to vector store:`, error);
      }
    } else {
      console.log(`File "${file}" already exists in vector store.`);
    }
  }

  console.log('Ingestion process completed.');
}

module.exports = {
  initPlugin,
  ingestDocs,
  CheckTest,
};
