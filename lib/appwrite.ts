import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.luzhnyak.shovi",
  projectId: "6794bdde000d49094432",
  databaseId: "6794c1340018f73e1ad7",
  userCollectionId: "6794c17600026903e010",
  videoCollectionId: "6794c1c7003661a386c2",
  storageId: "6794c38f002536d71f39",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatars = new Avatars(client);
const database = new Databases(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  // Register User
  try {
    const accId = ID.unique();

    console.log("accId", accId);

    const newAccount = await account.create(accId, email, password, username);

    if (!newAccount) {
      throw new Error("User creation failed");
    }

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await database.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.log("createUser " + error);
    throw new Error(error?.toString());
  }
  //   account.create(ID.unique(), "me@example.com", "password", "Jane Doe").then(
  //     function (response) {
  //       console.log(response);
  //     },
  //     function (error) {}
  //   );
};

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log("signIn " + error?.toString());

    throw new Error("signIn " + error?.toString());
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const documentList = await database.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    const currentUser = documentList.documents as any[];

    if (!currentUser || currentUser?.length === 0) throw Error;

    return currentUser[0];
  } catch (error) {
    console.log(error);
  }
};

export type Post = {
  $id: string;
  title: string;
  thumbnail: string;
  pront: string;
  video: string;
  creator: {
    username: string;
    avatar: string;
  };
};

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videoCollectionId
    );

    return posts.documents as any[];
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const getLatestPosts = async (): Promise<Post[]> => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents as any[];
  } catch (error) {
    throw new Error(error?.toString());
  }
};
