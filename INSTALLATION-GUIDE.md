# Installation Guide for Google Photos Toolkit with Album Metadata

## Prerequisites
1. Node.js (version 12 or higher)
2. A userscript manager for your browser (Violentmonkey, Tampermonkey, etc.)

## Installation Steps

### 1. Install Node.js
If you don't have Node.js installed:
- Visit https://nodejs.org/
- Download and install the LTS version
- Verify installation by opening a terminal/command prompt and running:
  ```
  node --version
  npm --version
  ```

### 2. Install Dependencies
Open a terminal/command prompt in the project directory and run:
```
npm install
```

### 3. Build the Project
Run the build command:
```
npm run build
```

This will create the userscript file `google_photos_toolkit.user.js` in the project root directory.

### 4. Install the Userscript
1. Open your userscript manager dashboard
2. Click "Import" or "Add new script"
3. Choose the `google_photos_toolkit.user.js` file from the project directory
4. Save the script

### 5. Verify Installation
1. Open Google Photos in your browser
2. You should see a GPTK icon in your browser toolbar or on the Google Photos page
3. The new yellow "Write Album Info to Description" button should be visible in the action bar

## Troubleshooting

### If the build fails:
1. Make sure all dependencies are installed: `npm install`
2. Check that you're using a compatible version of Node.js
3. Clear the node_modules folder and reinstall: 
   ```
   rm -rf node_modules
   npm install
   ```

### If the userscript doesn't work:
1. Make sure your userscript manager is enabled
2. Check that the script is properly installed and enabled
3. Try refreshing Google Photos
4. Check the browser console for any error messages

## Usage Instructions

1. Open Google Photos in your browser
2. Click the GPTK icon to open the toolkit
3. Select your desired filters to choose which photos to process
4. Enable "Dry Run" in advanced settings if you want to preview changes first
5. Click the yellow "Write Album Info to Description" button
6. Confirm the action in the dialog
7. The tool will process all selected photos, appending album information to their descriptions

## For Your Migration Workflow

1. Run this tool on your Google Photos library to embed album information in photo descriptions
2. Download a new Google Takeout after running the tool
3. The takeout will include the album information in the photo descriptions
4. Use a modified immich-go that reads this album information to properly organize your photos in Immich
