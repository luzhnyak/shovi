import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
  ImageGravity,
} from "react-native-appwrite";
import { Form } from "../app/(tabs)/create";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.luzhnyak.shovi",
  projectId: "6799ed07001c6d83e9d9",
  databaseId: "6799ed1c002c03132919",
  userCollectionId: "6799ed88003c38daf487",
  videoCollectionId: "6799ed9e0018d55eb7b6",
  storageId: "6799edbc002e005bd591",
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
const storage = new Storage(client);

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

    return currentUser[0] as any;
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
      config.videoCollectionId,
      [Query.orderDesc("$createdAt")]
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
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents as any[];
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents as any[];
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videoCollectionId,
      [Query.equal("creator", userId)]
    );

    return posts.documents as any[];
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const getFilePreview = async (
  fileId: string,
  type: "video" | "image"
) => {
  let fileUrl: string | null = null;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId).toString();
    } else if (type === "image") {
      fileUrl = storage
        .getFilePreview(
          config.storageId,
          fileId,
          2000,
          2000,
          ImageGravity.Top,
          100
        )
        .toString();
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) {
      throw new Error("File preview failed");
    }

    return fileUrl;
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const uploadFile = async (file: any, type: "video" | "image") => {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const fileId = ID.unique();

    const uploadedFile = await storage.createFile(
      config.storageId,
      fileId,
      asset
    );

    if (!uploadedFile) {
      throw new Error("File upload failed");
    }

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return fileUrl;
  } catch (error) {
    throw new Error(error?.toString());
  }
};

export const createVideo = async (form: Form) => {
  try {
    const [videoUrl, thumbnailUrl] = await Promise.all([
      uploadFile(form.video, "video"),
      uploadFile(form.thumbnail, "image"),
    ]);

    const newPost = await database.createDocument(
      config.databaseId,
      config.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        promt: form.promt,
        video: videoUrl,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error?.toString());
  }
};
