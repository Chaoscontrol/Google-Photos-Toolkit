# Build Instructions for Google Photos Toolkit with Album Metadata

## Why a Complete Build Requires Node.js

The Google Photos Toolkit is a complex project that uses modern JavaScript modules and requires bundling to work as a userscript. The source code is organized into multiple files that need to be combined and processed to create a single userscript file.

## What's Needed for a Proper Build

1. **Node.js**: Required for running the build tools
2. **npm**: Node.js package manager for installing dependencies
3. **Rollup**: The bundler used to combine all source files
4. **Plugins**: Various Rollup plugins for processing HTML, CSS, and other assets

## Manual Build Process

If you want to create a proper build without using npm, you would need to:

1. **Combine all JavaScript files**:
   - Start with src/index.js as the entry point
   - Manually copy and paste the contents of all imported modules
   - Resolve all dependencies manually

2. **Process HTML templates**:
   - Convert src/ui/markup/gptk-main-template.html to a JavaScript string
   - Include this string in the main code

3. **Process CSS**:
   - Convert src/ui/markup/style.css to a JavaScript string
   - Include this string in the main code

4. **Handle the metadata**:
   - Generate the userscript header from package.json information

## Why This Is Complex

The toolkit uses:
- ES6 module imports/exports
- HTML template imports
- CSS imports
- Build-time variable replacement
- Complex dependency tree

Manually combining all these elements would be extremely time-consuming and error-prone.

## Recommended Approach

1. **Install Node.js** from https://nodejs.org/
2. **Add Node.js to your PATH**:
   - On Windows: The installer usually adds Node.js to your PATH automatically
   - On macOS/Linux: You may need to add Node.js to your PATH manually
   - Verify installation by opening a new terminal and running `node --version` and `npm --version`
3. **Open a terminal** in the project directory
4. **Install dependencies**:
   ```
   npm install
   ```
5. **Build the project**:
   ```
   npm run build
   ```

This will create a fully functional `google_photos_toolkit.user.js` file that includes:
- All the original Google Photos Toolkit features
- The new "Write Album Info to Description" feature
- The dry-run option
- All UI elements and functionality

## Alternative: Docker Build

If you prefer not to install Node.js locally, you could use Docker:

1. Create a Dockerfile:
   ```dockerfile
   FROM node:16
   WORKDIR /app
   COPY . .
   RUN npm install
   RUN npm run build
   ```

2. Build and run:
   ```
   docker build -t gptk-builder .
   docker run --rm -v $(pwd):/app gptk-builder
   ```

This would create the built userscript file in your project directory.

## Summary

While I've created a placeholder userscript file, a proper implementation requires the build tools because of the complexity of modern JavaScript development. The build process handles:
- Module resolution
- Code minification
- Asset inlining
- Metadata generation
- Compatibility transformations

For your use case of migrating Google Photos to Immich, following the installation guide to create a proper build will give you the most reliable and feature-complete solution.
