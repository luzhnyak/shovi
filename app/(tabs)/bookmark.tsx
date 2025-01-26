import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const Bookmark = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Text className="text-white text-center font-bold text-2xl">
        Bookmark
      </Text>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Bookmark;
