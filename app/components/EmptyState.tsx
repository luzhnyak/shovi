import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";

type EmptyStateProps = {
  title: string;
  subtitle: string;
};

const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-white text-center text-xl font-psemibold mt-2">
        {title}
      </Text>
      <Text className="text-gray-100 text-center text-sm font-pmedium">
        {subtitle}
      </Text>
      <CustomButton
        title="Create video"
        handlePress={() => {
          router.push("/create");
        }}
        containerStyles="w-full mt-5"
      />
    </View>
  );
};

export default EmptyState;
