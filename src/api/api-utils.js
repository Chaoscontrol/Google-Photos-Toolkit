import Api from './api.js';
import log from '../ui/logic/log.js';
import splitArrayIntoChunks from '../utils/splitArrayIntoChunks.js';
import { apiSettingsDefault } from './api-utils-default-presets.js';

export default class ApiUtils {
  constructor(core = null, settings) {
    this.api = new Api();
    this.executeWithConcurrency = this.executeWithConcurrency.bind(this);
    this.getAllItems = this.getAllItems.bind(this);
    this.copyOneDescriptionFromOther = this.copyOneDescriptionFromOther.bind(this);
    this.writeOneAlbumInfoToDescription = this.writeOneAlbumInfoToDescription.bind(this);
    this.core = core;
    let { maxConcurrentSingleApiReq, maxConcurrentBatchApiReq, operationSize, infoSize, lockedFolderOpSize } =
      settings || apiSettingsDefault;

    this.maxConcurrentSingleApiReq = parseInt(maxConcurrentSingleApiReq);
    this.maxConcurrentBatchApiReq = parseInt(maxConcurrentBatchApiReq);
    this.operationSize = parseInt(operationSize);
    this.lockedFolderOpSize = parseInt(lockedFolderOpSize);
    this.infoSize = parseInt(infoSize);
  }

  async executeWithConcurrency(apiMethod, operationSize, itemsArray, ...args) {
    const promisePool = new Set();
    const results = [];
    const chunkedItems = splitArrayIntoChunks(itemsArray, operationSize);
    const maxConcurrentApiReq =
      operationSize == 1 ? this.maxConcurrentSingleApiReq : this.maxConcurrentBatchApiReq;

    for (const chunk of chunkedItems) {
      if (!this.core.isProcessRunning) return;

      while (promisePool.size >= maxConcurrentApiReq) {
        await Promise.race(promisePool);
      }

      if (operationSize != 1) log(`Processing ${chunk.length} items`);

      const promise = apiMethod.call(this.api, chunk, ...args);
      promisePool.add(promise);

      promise
        .then((result) => {
          results.push(...result);
          if (!Array.isArray(result)) {
            log(`Error executing action ${apiMethod.name}`, 'error');
          } else if (operationSize == 1 && results.length % 100 == 0) {
            log(`Processed ${results.length} items`);
          }
        })
        .catch((error) => {
          log(`${apiMethod.name} Api error ${error}`, 'error');
        })
        .finally(() => {
          promisePool.delete(promise);
        });
    }
    await Promise.all(promisePool);
    return results;
  }

  async getAllItems(apiMethod, ...args) {
    const items = [];
    let nextPageId = null;
    do {
      if (!this.core.isProcessRunning) return;
      const page = await apiMethod.call(this.api, ...args, nextPageId);
      if (page?.items?.length > 0) {
        log(`Found ${page.items.length} items`);
        items.push(...page.items);
      }
      nextPageId = page?.nextPageId;
    } while (nextPageId);
    return items;
  }

  async getAllAlbums() {
    return await this.getAllItems(this.api.getAlbums);
  }

  async getAllSharedLinks() {
    return await this.getAllItems(this.api.getSharedLinks);
  }

  async getAllMediaInSharedLink(sharedLinkId) {
    return await this.getAllItems(this.api.getAlbumPage, sharedLinkId);
  }

  async getAllMediaInAlbum(albumMediaKey) {
    return await this.getAllItems(this.api.getAlbumPage, albumMediaKey);
  }

  async getAllTrashItems() {
    return await this.getAllItems(this.api.getTrashItems);
  }

  async getAllFavoriteItems() {
    return await this.getAllItems(this.api.getFavoriteItems);
  }

  async getAllSearchItems(searchQuery) {
    return await this.getAllItems(this.api.search, searchQuery);
  }

  async getAllLockedFolderItems() {
    return await this.getAllItems(this.api.getLockedFolderItems);
  }

  async moveToLockedFolder(mediaItems) {
    log(`Moving ${mediaItems.length} items to locked folder`);
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    await this.executeWithConcurrency(this.api.moveToLockedFolder, this.lockedFolderOpSize, dedupKeyArray);
  }

  async removeFromLockedFolder(mediaItems) {
    log(`Moving ${mediaItems.length} items out of locked folder`);
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    await this.executeWithConcurrency(this.api.removeFromLockedFolder, this.lockedFolderOpSize, dedupKeyArray);
  }

  async moveToTrash(mediaItems) {
    log(`Moving ${mediaItems.length} items to trash`);
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    await this.executeWithConcurrency(this.api.moveItemsToTrash, this.operationSize, dedupKeyArray);
  }

  async restoreFromTrash(trashItems) {
    log(`Restoring ${trashItems.length} items from trash`);
    const dedupKeyArray = trashItems.map((item) => item.dedupKey);
    await this.executeWithConcurrency(this.api.restoreFromTrash, this.operationSize, dedupKeyArray);
  }

  async sendToArchive(mediaItems) {
    log(`Sending ${mediaItems.length} items to archive`);
    mediaItems = mediaItems.filter((item) => item?.isArchived !== true);
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    if (!mediaItems) {
      log('All target items are already archived');
      return;
    }
    await this.executeWithConcurrency(this.api.setArchive, this.operationSize, dedupKeyArray, true);
  }

  async unArchive(mediaItems) {
    log(`Removing ${mediaItems.length} items from archive`);
    mediaItems = mediaItems.filter((item) => item?.isArchived !== false);
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    if (!mediaItems) {
      log('All target items are not archived');
      return;
    }
    await this.executeWithConcurrency(this.api.setArchive, this.operationSize, dedupKeyArray, false);
  }

  async setAsFavorite(mediaItems) {
    log(`Setting ${mediaItems.length} items as favorite`);
    mediaItems = mediaItems.filter((item) => item?.isFavorite !== true);
    if (!mediaItems) {
      log('All target items are already favorite');
      return;
    }
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    await this.executeWithConcurrency(this.api.setFavorite, this.operationSize, dedupKeyArray, true);
  }

  async unFavorite(mediaItems) {
    log(`Removing ${mediaItems.length} items from favorites`);
    mediaItems = mediaItems.filter((item) => item?.isFavorite !== false);
    if (!mediaItems) {
      log('All target items are not favorite');
      return;
    }
    const dedupKeyArray = mediaItems.map((item) => item.dedupKey);
    await this.executeWithConcurrency(this.api.setFavorite, this.operationSize, dedupKeyArray, false);
  }

  async addToExistingAlbum(mediaItems, targetAlbum, preserveOrder = false) {
    log(`Adding ${mediaItems.length} items to album "${targetAlbum.title}"`);
    const mediaKeyArray = mediaItems.map((item) => item.mediaKey);

    const addItemFunction = targetAlbum.isShared ? this.api.addItemsToSharedAlbum : this.api.addItemsToAlbum;

    await this.executeWithConcurrency(addItemFunction, this.operationSize, mediaKeyArray, targetAlbum.mediaKey);

    if (preserveOrder) {
      log('Setting album item order');
      const albumItems = await this.getAllMediaInAlbum(targetAlbum.mediaKey);
      console.log('mediaItems');
      console.log(mediaItems);
      console.log('albumItems');
      console.log(albumItems);
      const orderMap = new Map();
      mediaItems.forEach((item, index) => {
        orderMap.set(item.dedupKey, index);
      });
      const sortedAlbumItems = [...albumItems].sort((a, b) => {
        const indexA = orderMap.has(a.dedupKey) ? orderMap.get(a.dedupKey) : Infinity;
        const indexB = orderMap.has(b.dedupKey) ? orderMap.get(b.dedupKey) : Infinity;
        return indexA - indexB;
      });
      const sortedMediaKeys = sortedAlbumItems.map((item) => item.mediaKey);
      console.log('sortedMediaKeys');
      console.log(sortedMediaKeys);
      for (const key of sortedMediaKeys.reverse()) {
        await this.api.setAlbumItemOrder(targetAlbum.mediaKey, [key]);
      }
    }
  }

  async addToNewAlbum(mediaItems, targetAlbumName, preserveOrder = false) {
    log(`Creating new album "${targetAlbumName}"`);
    const album = {};
    album.title = targetAlbumName;
    album.shared = false;
    album.mediaKey = await this.api.createAlbum(targetAlbumName);
    await this.addToExistingAlbum(mediaItems, album, preserveOrder);
  }

  async getBatchMediaInfoChunked(mediaItems) {
    log("Getting items' media info");
    const mediaKeyArray = mediaItems.map((item) => item.mediaKey);
    const mediaInfoData = await this.executeWithConcurrency(this.api.getBatchMediaInfo, this.infoSize, mediaKeyArray);
    return mediaInfoData;
  }

  async copyOneDescriptionFromOther(mediaItems) {
    // This method returns an array containing a single boolean indicating
    // whether the description was copied.  This lets us do two things: (1)
    // log progress as we go along (since this operation is slow compared to
    // batch operations), and (2) report to the user how many descriptions
    // were actually copied (since sometimes they aren't, see below).
    try {
      const item = mediaItems[0];
      const itemInfoExt = await this.api.getItemInfoExt(item.mediaKey);
      // To be safe, we only copy the description if the Google Photos
      // description field is empty and the 'Other' description is non-empty.
      if (itemInfoExt.descriptionFull || !itemInfoExt.other) {
        return [false];
      }
      // The Google Photos API doesn't allow the description to be identical
      // to the "Other" field.  Adding leading or trailing spaces doesn't
      // work - if you try this using the web app, it simply deletes the
      // description, and if you set it using the API directly then it
      // ignores the description at display time.  However it *does* work to
      // add a zero-width space (U+200B) since that character is not
      // considered to be whitespace.
      const description = itemInfoExt.other + "\u200B";
      await this.api.setItemDescription(item.dedupKey, description);
      return [true];
    } catch (error) {
      console.error('Error in copyOneDescriptionFromOther:', error);
      throw error;
    }
  }

  async copyDescriptionFromOther(mediaItems) {
    // Note that api.getBatchMediaInfo cannot be used to optimize this process
    // since that method returns a non-empty descriptionFull field if either
    // the actual "descriptionFull" field or the "other" field is set.  Only
    // api.getItemInfoExt distinguishes between the two.
    log(`Copying up to ${mediaItems.length} descriptions from 'Other' field`);
    const results = await this.executeWithConcurrency(this.copyOneDescriptionFromOther, 1, mediaItems);
    log(`Copied ${results.filter(Boolean).length} descriptions from 'Other' field`);
  }

  async writeOneAlbumInfoToDescription(mediaItems, apiSettings) {
    try {
      const item = mediaItems[0];
      const dryRun = apiSettings?.dryRun === 'true';
      
      // Get extended information which includes album data
      const itemInfoExt = await this.api.getItemInfoExt(item.mediaKey);
      
      // Check if we got valid information
      if (!itemInfoExt) {
        log(`Item ${item.mediaKey}: Shared asset. You can't edit its description.`);
        return [false];
      }
      
      // Check if the item belongs to any albums
      if (!itemInfoExt.albums || itemInfoExt.albums.length === 0) {
        log(`Item ${item.mediaKey} is not in any albums`);
        return [false];
      }
      
      // Extract album titles
      const albumTitles = itemInfoExt.albums.map(album => album.title).filter(title => title);
      
      if (albumTitles.length === 0) {
        log(`Item ${item.mediaKey} has no album titles`);
        return [false];
      }
      
      // Format album information
      const albumInfo = `album_name: ${albumTitles.join(', ')}`;
      
      // Get current description
      const currentDescription = itemInfoExt.descriptionFull || '';
      
      // Create new description by appending album info
      let newDescription = currentDescription;
      if (currentDescription && !currentDescription.endsWith('\n')) {
        newDescription += '\n';
      } else if (currentDescription && currentDescription.endsWith('\n')) {
        // Remove trailing newline to avoid double newlines
        newDescription = currentDescription.slice(0, -1);
      }
      newDescription += albumInfo;
      
      // Log what would be changed
      log(`Item ${item.mediaKey}: ${dryRun ? '[DRY RUN] Would update' : 'Updating'} description from "${currentDescription}" to "${newDescription}"`);
      
      // Update description if not in dry run mode
      if (!dryRun) {
        await this.api.setItemDescription(item.dedupKey, newDescription);
      }
      
      return [true];
    } catch (error) {
      console.error('Error in writeOneAlbumInfoToDescription:', error);
      log(`Error processing item ${mediaItems[0]?.mediaKey}: ${error.message}`, 'error');
      throw error;
    }
  }

  async writeAlbumInfoToDescription(mediaItems, apiSettings) {
    const dryRun = apiSettings?.dryRun === 'true';
    log(`${dryRun ? '[DRY RUN] ' : ''}Writing album information to descriptions of ${mediaItems.length} items`);
    const results = await this.executeWithConcurrency(this.writeOneAlbumInfoToDescription, 1, mediaItems, apiSettings);
    const updatedCount = results.filter(Boolean).length;
    log(`${dryRun ? '[DRY RUN] ' : ''}Processed ${mediaItems.length} items, ${dryRun ? 'would update' : 'updated'} ${updatedCount} items`);
  }
}
