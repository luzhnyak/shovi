import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { FC, useState } from "react";

import { icons } from "../../constants";
import { router, usePathname } from "expo-router";

type FormFieldProps = {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
};

type SearchInputProps = {
  initialQuery?: string;
};

export default function SearchInput({ initialQuery }: SearchInputProps) {
  const [query, setQuery] = useState(initialQuery || "");
  const pathname = usePathname();
  return (
    <View className="border-2 w-full h-16 px-4 bg-black-100 border-black-200 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-white font-pregular mt-0.5 text-base flex-1"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor={"#cdcde0"}
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            Alert.alert("Please enter a search query");
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}
