import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

/**
 * Checks if a persist file currently exists. If not, it creates one automatically.
 *
 * @returns Directory path to the existing/created persist file path.
 */
export const ensureFileExists = async (): Promise<string> => {
  try {
    const dir = FileSystem.documentDirectory + 'videos';
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }

    return dir;
  } catch (error: any) {
    console.error('Failed to create video directory:', error);
    return FileSystem.documentDirectory ?? '';
  }
};

export type PersistResult = { ok: true; destinationUri: string } | { ok: false; error: Error };

/**
 * Creates a copy of the cached video and stores it on the app's local persist storage.
 *
 * @param localUri The URI of the temporarily cached video.
 * @param preferredDir Optional directory to persist the video under.
 * @returns PersistResult object specifying the destinationUri if successfully persisted. Otherwise, an error.
 */
export const persistRecordingLocally = async (
  localUri: string,
  preferredDir?: string
): Promise<PersistResult> => {
  try {
    let dir = preferredDir ?? (await ensureFileExists());

    // Ensure we are sending our file to a subdirectory.
    if (!dir.endsWith('/')) {
      dir = dir + '/';
    }

    const timestamp = normalizeToValidPathString(new Date().toISOString());
    const extension = getFileExtensionType(localUri);
    const filename = `recording-${timestamp}.${extension}`;
    const destination = dir + filename;
    await FileSystem.copyAsync({ from: localUri, to: destination });

    return { ok: true, destinationUri: destination };
  } catch (error: any) {
    console.error('persistRecordingLocally failed:', error);
    return { ok: false, error };
  }
};

/**
 * Transforms string passed in to only contain legal characters for file pathing.
 *
 * @param stringToNormalize Any path/directory related string.
 * @returns Legal string version of the file path.
 */
export const normalizeToValidPathString = (stringToNormalize: string): string => {
  return stringToNormalize.replace(/[:.]/g, '-');
};

/**
 * Figures out the video's extension type. If none is found, we assume mp4 by default.
 *
 * @param uri URI to the video in cache.
 * @returns The extension type as a string.
 */
export const getFileExtensionType = (uri: string): string => {
  const match = /\.([a-zA-Z0-9]+)(?:\?|$)/.exec(uri);
  return match ? match[1] : 'mp4';
};

export type GalleryResult = { ok: true; assetId: string } | { ok: false; error: Error };

/**
 * Allows user to save videos directly into their media gallery for viewing later. Requests permission from user before doing so.
 *
 * @param localUri The URI of the temporarily cached video.
 * @param albumName The name of the album the video will be saved to.
 * @returns GalleryResult object containing the asset's id if successful. Otherwise, an error.
 */
export const saveToGallery = async (
  localUri: string,
  albumName = 'RecordTheseHands'
): Promise<GalleryResult> => {
  try {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync(true);
    if (!mediaLibraryPermission.granted) {
      return { ok: false, error: new Error('MediaLibrary permission not granted') };
    }
    console.log(await MediaLibrary.getPermissionsAsync());

    const asset = await MediaLibrary.createAssetAsync(localUri);

    let album = await MediaLibrary.getAlbumAsync(albumName);
    if (!album) {
      album = await MediaLibrary.createAlbumAsync(albumName, asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    return { ok: true, assetId: asset.id };
  } catch (error: any) {
    console.error('saveToGallery failed:', error);
    return { ok: false, error };
  }
};
