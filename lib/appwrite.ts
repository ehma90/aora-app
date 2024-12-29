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

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(
  email: string,
  password: string,
  username: string
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

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

    // return newUser;
  } catch (error) {
    if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Sign In
export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    if (typeof error === "string") {
      throw new Error(error);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

// Get Account
export const getAccount = async() => {
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
}

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
