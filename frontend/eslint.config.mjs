// Importing required modules for ESLint configuration
import globals from "globals"; // Provides global variable definitions for different environments (browser, node, etc.)
import tseslint from "typescript-eslint"; // Imports TypeScript ESLint plugin configuration
import pluginReact from "eslint-plugin-react"; // Imports the React ESLint plugin configuration

/** 
 * @type {import('eslint').Linter.Config[]} 
 * This is the ESLint configuration that will be exported.
 * The configuration is an array of rule objects that ESLint uses to lint your code.
 */
export default [
  // 1. Define the files to be linted. This applies the configuration to JavaScript, TypeScript, and JSX files.
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},

  // 2. Set global variables for both browser and node environments.
  // This ensures that variables like 'window' (for browser) and 'process' (for node) are recognized and not flagged as undefined.
  {languageOptions: { 
    globals: {
      ...globals.browser, // Import global variables specific to browser environments.
      ...globals.node // Import global variables specific to node environments.
    }
  }},

  // 3. Include recommended TypeScript ESLint configuration rules.
  // These rules are generally good for any TypeScript project to ensure better type safety and quality.
  ...tseslint.configs.recommended, 

  // 4. Include recommended React ESLint configuration rules.
  // These rules help ensure that your React components and JSX are written according to best practices.
  pluginReact.configs.flat.recommended,
  {rules: {
    // Allow variables prefixed with "_" to be unused without error
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    }
  },
  {settings: {
    react: {
      version: "detect", // Automatically detect the React version
    }
  }}  
];
