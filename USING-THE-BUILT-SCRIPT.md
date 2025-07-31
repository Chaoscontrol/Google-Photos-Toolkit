# Using the Built Google Photos Toolkit with Album Metadata

Congratulations! You have successfully built the Google Photos Toolkit with the new Album Metadata feature. Here's how to use it:

## Installation

1. **Locate the Built File**: The built userscript is named `google_photos_toolkit.user.js` and is located in the project root directory.

2. **Install in Your Browser**:
   - Open your userscript manager (Violentmonkey, Tampermonkey, etc.)
   - Click on "Import" or "Add new script"
   - Choose the `google_photos_toolkit.user.js` file
   - Save the script

## Verifying Installation

1. Open Google Photos in your browser (https://photos.google.com/)
2. You should see the GPTK icon/button on the page
3. Click the GPTK icon to open the toolkit interface
4. You should see a new yellow button labeled "Write Album Info to Description"

## Using the New Feature

### 1. Select Photos to Process
- Use the filters to select which photos you want to process
- You can filter by date, albums, search terms, etc.

### 2. Enable Safety Features (Recommended)
- Open "Advanced Settings"
- Check "Dry Run (Preview changes without applying them)" to preview changes first
- Adjust other settings as needed

### 3. Run the Feature
- Click the yellow "Write Album Info to Description" button
- Confirm the action in the dialog that appears
- Watch the log area for progress updates

### 4. Review Results
- In dry-run mode, you'll see what changes would be made without actually making them
- In normal mode, the tool will update photo descriptions with album information

## For Your Migration Workflow

### Step 1: Run the Tool
1. Open Google Photos
2. Open the GPTK toolkit
3. Select all photos or use filters to select the ones you want to process
4. Run the "Write Album Info to Description" feature

### Step 2: Create a New Takeout
1. Go to Google Takeout (https://takeout.google.com/)
2. Select Google Photos
3. Create a new takeout with the same settings as before
4. Download the takeout when it's ready

### Step 3: Process with Immich-go
1. The takeout will now include album information in photo descriptions
2. Use a modified immich-go that can read this album information
3. Photos will be properly organized in albums in Immich

## Safety Features

### Dry Run Mode
- Enable this in Advanced Settings to preview changes
- No actual changes are made to your photos
- You can see exactly what would be updated

### Rate Limiting
- The tool automatically limits API requests to prevent issues
- Processing may take some time for large collections

### Logging
- All actions are logged in the log area
- Errors are clearly displayed
- Progress updates are shown

## Troubleshooting

### If the Tool Doesn't Appear
- Make sure the userscript is enabled in your userscript manager
- Refresh Google Photos
- Check the browser console for errors (F12)

### If Photos Aren't Being Updated
- Check that the photos are actually in albums
- Verify you have permission to modify the photo descriptions
- Check the log for error messages

### Performance Issues
- Process photos in smaller batches using filters
- The tool respects Google's API rate limits

### Previous Issues Fixed
- If you encountered a "Cannot read properties of undefined (reading 'getItemInfoExt')" error, this has been fixed in the latest build
- The issue was that the method wasn't properly bound in the constructor
- Dry-run functionality has been fixed to properly preview changes without applying them
- The "Write Album Info to Description" button now matches the styling of other action buttons
- The main GPTK button color has been changed to yellow (#FFD700) for better visibility
- Fixed null check issue when processing items that don't return extended information
- Fixed settings passing to ensure dry-run mode works correctly
- Improved error messaging for shared assets that can't be modified (now shows "Shared asset. You can't edit its description.")
- Please use the latest `google_photos_toolkit.user.js` file which includes all these fixes

## Technical Details

The new feature works by:
1. Taking selected items from the current filter
2. For each item, fetching extended information using Google Photos API to get album membership
3. Formatting album names as "album_name: Album1, Album2" (comma-separated for multiple albums)
4. Appending this information to existing descriptions
5. Supporting dry-run mode that shows what would be changed without actually changing it

## File Information

- **File Name**: `google_photos_toolkit.user.js`
- **Size**: ~151 KB
- **Version**: 2.10.1
- **Features**: All original GPTK features plus the new Album Metadata feature

You're now ready to use the tool to help with your Google Photos to Immich migration!
