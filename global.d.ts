declare module "expo-document-picker" {
    export function getDocumentAsync(
      options: {
        type?: string[]; // Array of MIME types
        multiple?: boolean; // Allow multiple files
        copyToCacheDirectory?: boolean; // Copy files to cache
      }
    ): Promise<{
      type: "success" | "cancel";
      uri?: string; // File URI
      name?: string; // File name
      size?: number; // File size in bytes
      mimeType?: string;
      assets: any[] // MIME type
    }>;
  }