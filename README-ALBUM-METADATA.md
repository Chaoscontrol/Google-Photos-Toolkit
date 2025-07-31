# Google Photos Toolkit with Album Metadata

This is a modified version of the Google Photos Toolkit that adds a new feature to write album information to photo descriptions.

## New Feature: Write Album Info to Description

This custom version adds a new action button "Write Album Info to Description" that writes album membership information to photo descriptions in the format:
```
album_name: Album1, Album2
```

### Features:
- **Yellow Button**: The new action button is colored yellow to distinguish it from the original toolkit
- **Dry Run Option**: A dry run option in advanced settings allows you to preview changes without applying them
- **Safety First**: Comprehensive logging for all operations
- **Append Mode**: Album information is appended to existing descriptions rather than replacing them
- **Multiple Albums**: Supports photos that belong to multiple albums (comma-separated list)

### Installation:
1. Make sure you have Node.js installed on your system
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. The built userscript will be available as `google_photos_toolkit.user.js`
5. Install the userscript using your preferred userscript manager (Violentmonkey, Tampermonkey, etc.)

### Usage:
1. Open Google Photos in your browser
2. Click the GPTK icon to open the toolkit
3. Select your desired filters to choose which photos to process
4. Click the yellow "Write Album Info to Description" button
5. Confirm the action in the dialog
6. The tool will process all selected photos, appending album information to their descriptions

### Safety Features:
- **Dry Run Mode**: Enable "Dry Run" in advanced settings to preview changes without actually modifying descriptions
- **Rate Limiting**: Built-in rate limiting to prevent API abuse
- **Detailed Logging**: Comprehensive logging of all operations
- **Confirmation Dialogs**: Action confirmation before processing

### For Your Use Case:
This modified toolkit is specifically designed to help with your Google Photos to Immich migration. After running this tool on your Google Photos library:
1. Download a new Google Takeout
2. The takeout will include the album information in the photo descriptions
3. You can then use a modified immich-go that reads this album information to properly organize your photos

## Original Google Photos Toolkit
For more information about the original toolkit, visit: https://github.com/xob0t/Google-Photos-Toolkit
