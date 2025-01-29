import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import FormField from "../components/FormField";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "../../constants";
import CustomButton from "../components/CustomButton";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

export type Form = {
  title: string;
  thumbnail?: { uri: string } | null;
  video?: { uri: string } | null;
  promt: string;
  userId?: string;
};

const Create = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [uploading, setUoloading] = useState(false);

  const [form, setForm] = useState<Form>({
    title: "",
    video: null,
    thumbnail: null,
    promt: "",
  });

  const openPicker = async (selectType: "video" | "image") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: selectType === "image" ? ["images"] : ["videos"],
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (selectType === "image") {
          setForm({ ...form, thumbnail: result.assets[0] });
        }

        if (selectType === "video") {
          setForm({ ...form, video: result.assets[0] });
        }
      } else {
        setTimeout(() => {
          Alert.alert("Document picked", JSON.stringify(result, null, 2));
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: any) => {
    if (!form.title || !form.video || !form.promt || !form.thumbnail) {
      Alert.alert("Please fill all fields");
      return;
    }
    setUoloading(true);
    try {
      await createVideo({ ...form, userId: user.$id });
      Alert.alert("Success", "Video uploaded successfully");
      router.push("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        promt: "",
      });
      setUoloading(false);
    }
  };

  // let player = useVideoPlayer(form.video!.uri, (player) => {
  //   player.loop = true;
  // });

  // // Using a conditional check
  // if (form.video && form.video.uri) {
  //   let player = useVideoPlayer(form.video.uri, (player) => {
  //     player.loop = true;
  //   });
  // }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 py-6">
        <Text className="text-white font-psemibold text-2xl">Upload video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Enter video title"
          handleChangeText={(text) => setForm({ ...form, title: text })}
          otherStyles="mt-10"
        />
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Upload Video
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <View className="w-full h-64 rounded-2xl mt-3 bg-white/10 overflow-hidden">
                {/* <VideoView className="" player={player}>
                  <View className="w-full h-60"></View>
                </VideoView> */}
              </View>
            ) : (
              <View className="w-full h-40 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-200 justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <View className="w-full h-64 rounded-2xl mt-3 bg-white/10 overflow-hidden">
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className="w-full h-64 rounded-2xl"
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View className="w-full h-16 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-gray-100 text-sm font-pmedium ms-2">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Promt"
          value={form.promt}
          placeholder="Enter AI promt"
          handleChangeText={(text) => setForm({ ...form, promt: text })}
          otherStyles="mt-7"
        />
        <CustomButton
          title="Submit & Publish"
          containerStyles="mt-7"
          handlePress={async () => await handleSubmit("s")}
          isLoading={uploading}
        />
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Create;
