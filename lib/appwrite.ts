import {
  Client,
  Account,
  ID,
  Avatars,
  Storage,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.ehma.aora",
  projectId: "6771598b00081b5e38a9",
  storageId: "6771887800024028b809",
  databaseId: "677184be002fead8b12d",
  userCollectionId: "677184f2000d1cf3f348",
  videoCollectionId: "6771854e002b510f40ec",
};

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw error;
  }
};

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error: any) {
    throw new Error(error?.message || "Sign-in failed");
  }
}

// Get Account
export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Get all post
export const getAllPost = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw error;
  }
};

// Get latest created video posts
export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents;
  } catch (error) {
    throw error;
  }
};

// Get video posts that matches search query
export const searchPosts = async (query: any) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw error;
  }
};

// Get video posts created by user
export const getUserPosts = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents;
  } catch (error) {
    throw error;
  }
};

// Sign Out
export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    throw error;
  }
};

export const uploadFile = async (file: any, type: any) => {
  if (!file) {
    throw new Error("No file selected");
  }

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    // Upload the file to Appwrite storage
    const uploadedFile = await storage.createFile(
      config.storageId, // Replace with your Appwrite storage bucket ID
      ID.unique(), // Generate a unique ID for the file
      asset
    );

    if (!uploadedFile || !uploadedFile.$id) {
      throw new Error("Failed to upload file. No $id found.");
    }

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getFilePreview = async (fileId: string, type: string) => {
  try {
    let fileUrl;

    // Get the file preview URL based on the type (image/video)
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(config.storageId, fileId);
    } else {
      throw new Error("Invalid file type");
    }

    // Ensure that a file URL is returned
    if (!fileUrl) {
      throw new Error("Failed to retrieve file preview");
    }

    return fileUrl;
  } catch (error) {
    console.error("Error getting file preview:", error);
    throw error;
  }
};

export const createVideoPost = async (form: any) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    console.log("thumbnail", thumbnailUrl);

    // Store the post details in the database
    const newPost = await databases.createDocument(
      config.databaseId, // Your Appwrite database ID
      config.videoCollectionId, // Your Appwrite collection ID
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl, // Store the thumbnail URL
        video: videoUrl, // Store the video URL
        prompt: form.prompt,
        creator: form.userId, // Assuming userId is passed in the form
      }
    );

    console.log(newPost);
  } catch (error) {
    console.error("Error creating video post:", error);
    throw new Error("Unable to create a video post");
  }
};
