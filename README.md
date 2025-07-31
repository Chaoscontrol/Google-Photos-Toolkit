# Google Photos Toolkit

Bulk organize your media

![demo](media/demo.png)

## How It Works

In your browser, utilizing GP's undocumented web api

## New Feature: Write Album Info to Description

This version includes a new action button "Write Album Info to Description" that writes album membership information to photo descriptions in the format:
```
album_name: Album1, Album2
```

### Features:
- **New Action Button**: Added a new action button to write album information to photo descriptions
- **Dry Run Option**: A dry run option in advanced settings allows you to preview changes without applying them
- **Safety First**: Comprehensive logging for all operations
- **Append Mode**: Album information is appended to existing descriptions rather than replacing them
- **Multiple Albums**: Supports photos that belong to multiple albums (comma-separated list)
- **Shared Asset Handling**: Properly handles shared assets with clear error messaging

## How To Install

1. Install any recommended userscript manager for your browser

   - [Violentmonkey](https://violentmonkey.github.io/)
   - [Tampermonkey](https://www.tampermonkey.net/)
   - If you're on Android, try [Firefox](https://www.mozilla.org/firefox/browsers/mobile/android/) browser, it supports Tampermonkey

2. Click [Install](https://github.com/Chaoscontrol/Google-Photos-Toolkit/releases/latest/download/google_photos_toolkit.user.js)
3. Accept installation

## Using the New Feature

### 1. Select Photos to Process
- Use the filters to select which photos you want to process
- You can filter by date, albums, search terms, etc.

### 2. Enable Safety Features (Recommended)
- Open "Advanced Settings"
- Check "Dry Run (Preview changes without applying them)" to preview changes first
- Adjust other settings as needed

### 3. Run the Feature
- Click the "Write Album Info to Description" button
- Confirm the action in the dialog that appears
- Watch the log area for progress updates

### 4. Review Results
- In dry-run mode, you'll see what changes would be made without actually making them
- In normal mode, the tool will update photo descriptions with album information

## For Google Photos to Immich Migration

This feature is specifically designed to help with Google Photos to Immich migration:

1. **Run the Tool**: Process your Google Photos library with the new feature
2. **Create a New Takeout**: Download a fresh Google Takeout after processing
3. **Album Information Preserved**: Takeout will include album information in photo descriptions
4. **Immich Import**: Use a modified immich-go that can read this album information for proper organization

## How to use

<details>
  <summary><strong>🚀 Click to expand: Tutorial</strong></summary>

1. Go to [photos.google.com](https://photos.google.com/) and click the GPTK icon in the top bar to open it

   ![demo](media/tutorial/step0.png)

2. Select a source from which to read from:

   ![demo](media/tutorial/step1.png)

3. Use Filters to filter found items with:

   ![demo](media/tutorial/step2.png)

4. Select an action to apply to found items:

   ![demo](media/tutorial/step3.png)

</details>

### Finding space-consuming media

This example groups all space-consuming media in one album.

1. Make sure "Library" is the selected source
2. Select `SPACE-CONSUMING` in the `Space` filter
3. Select action `Add to new album`

### Identify media not in any albums

Select all albums in the `Exclude albums` filter, then use appropriate action.

### Identifying duplicates/similar images

Use `Similarity` filter with action `Add to new album`
Media with similar thumbnails will be added to the album.

### Deleting all media in the library

As simple as selecting "Library" source, clicking `Move to trash`, then clearing it.

### Use GPTK's api

GPTK exports it's api class globally so you can use it in your browser's console.  
It's much more powerful than the UI!

Example usage.
Scan the whole library for media owned by `ownerName` and move it to trash if found.

```js
let nextPageId = null;
const ownerName = "John";
do {
  const page = await gptkApi.getItemsByUploadedDate(nextPageId);
  for (const item of page.items) {
    if (item.isOwned) continue;
    const itemInfo = await gptkApi.getItemInfoExt(item.mediaKey);
    console.log(`${item.mediaKey} is shared by ${itemInfo.owner.name}`);
    if (itemInfo.owner.name == ownerName) {
      await gptkApi.moveItemsToTrash([itemInfo.dedupKey]);
      console.log(`${item.mediaKey} moved to trash`);
    }
  }
  nextPageId = page.nextPageId;
} while (nextPageId);
console.log("DONE");
```

## Contributions welcome

If you want to learn more about how GP's api works, read [https://kovatch.medium.com/deciphering-google-batchexecute-74991e4e446c](https://kovatch.medium.com/deciphering-google-batchexecute-74991e4e446c)  
I just found this post, after doing all the work from zero :D

Also, i've made a userscript that parses all responses and logs them to console in a more readable way, you can find it here - [https://github.com/xob0t/Google-Photos-Toolkit/tree/main/tools](https://github.com/xob0t/Google-Photos-Toolkit/tree/main/tools)

## BUGS

If something does not work, open an [issue](https://github.com/xob0t/Google-Photos-Toolkit/issues) and describe it in detail

If you have a question, open a [discussion](https://github.com/xob0t/Google-Photos-Toolkit/discussions)

## Credits

Borrowed some code and UI inspiration from [undiscord](https://github.com/victornpb/undiscord)

## My Other Google Photos Projects

- Python client with unlimited uploads: [https://github.com/xob0t/gphotos_mobile_client](https://github.com/xob0t/gphotos_mobile_client)
- Disguise any file as media for GP to accept and store it: [https://github.com/xob0t/gp-file-hide](https://github.com/xob0t/gp-file-hide)

## ♥

If GPTK is useful to you, please consider supporting the project:

BTC `12znTocLytrrYhQT4AJVeJdR8KTULWbKb7`  
BTC Cash `qq7w48d6s3rddgxshl6ae48k7c5jyck76crvppqenn`  
DOGE `DQjBzT2qMuXkLMawUXG7umTf3k9VeT4Y6K`  
Etherium `0xcfe559D9F6056F82a6CFdEDA51c00132035955c8`  
Litecoin `ltc1qcgc873py5k28qm85sk5d53yfwzle4cztmvkh6l`
