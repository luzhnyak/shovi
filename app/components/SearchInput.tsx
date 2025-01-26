import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

import { icons } from "../../constants";

type FormFieldProps = {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
};

export default function SearchInput() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View className="border-2 w-full h-16 px-4 bg-black-100 border-black-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-white font-pregular mt-0.5 text-base flex-1"
        // value={value}
        placeholder="Search for a video topic"
        placeholderTextColor={"#7b7b8b"}
        // onChangeText={handleChangeText}
      />

      <TouchableOpacity onPress={() => {}}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
