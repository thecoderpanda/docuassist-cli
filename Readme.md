Sure, here is a detailed and comprehensive README.md file for the `docuassist` CLI tool:

### `README.md`

# DocuAssist CLI

DocuAssist is a CLI tool for managing Docusaurus documentation and vector store ingestion. It provides commands to install a plugin and ingest documents into a vector store.

## Table of Contents

- [Installation](#installation)
- [Commands](#commands)
  - [`docuassist plugin init`](#docuassist-plugin-init)
  - [`docuassist ingest`](#docuassist-ingest)
- [Options](#options)
  - [`-v, --version`](#-v---version)
- [Configuration](#configuration)
- [Development](#development)
  - [Linking the Package](#linking-the-package)
  - [Unlinking the Package](#unlinking-the-package)
- [Publishing](#publishing)
- [License](#license)

## Installation

To install the CLI tool globally, run:

```sh
npm install -g docuassist
```

## Commands

### `docuassist plugin init`

Installs the `docusaurus-docuassist` plugin in the Docusaurus directory. This command checks for Docusaurus installation in the current directory, installs the plugin, and updates the `docusaurus.config.js` file.

#### Usage

```sh
docuassist plugin init
```

#### Example

```sh
docuassist plugin init
```

After running this command, the `docusaurus.config.js` file will be updated with the following configuration:

```js
// docusaurus.config.js

module.exports = {
  // ...other config options
  plugins: [
    [
      'docusaurus-docuassist',
      {
        DocsDir: './docs',
        openAiKey: 'YOUR_OPENAI_API_KEY',
        openAiAssistantId: 'YOUR_OPENAI_ASSISTANT_ID',
      },
    ],
  ],
  customFields: {
    openAiKey: process.env.OPENAI_API_KEY,
    openAiAssistantId: process.env.OPENAI_ASSISTANT_ID,
  },
};
```

Make sure to replace `YOUR_OPENAI_API_KEY` and `YOUR_OPENAI_ASSISTANT_ID` with your actual OpenAI credentials.

### `docuassist ingest`

Ingests documents from the specified `docs` folder into the vector store. This command accesses the AssistantID from the `docusaurus.config.js` file, checks if the files exist in the vector store, and if not, pushes them to the vector store.

#### Usage

```sh
docuassist ingest
```

#### Example

```sh
docuassist ingest
```

This command will check the files in the `docs` folder, verify if they exist in the vector store, and add any missing files.

## Options

### `-v, --version`

Outputs the current version of the CLI tool.

#### Usage

```sh
docuassist --version
```

## Configuration

The `docuassist plugin init` command updates the `docusaurus.config.js` file with the necessary configuration for the `docusaurus-docuassist` plugin. The configuration includes the path to the `docs` directory and the OpenAI API credentials.

## Development

### Linking the Package

To test the CLI tool locally before publishing, you can link the package:

1. Navigate to the root directory of your `docuassist` project.
2. Run the following command to create a global symlink to your package:

```sh
npm link
```

Now you can run the `docuassist` commands as if the package was installed globally.

### Unlinking the Package

If you no longer need the local symlink, you can unlink the package:

```sh
npm unlink -g docuassist
```

## License

This project is licensed under the MIT License.