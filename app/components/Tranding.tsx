import { View, Text, FlatList } from "react-native";
import React from "react";

type TrandingProps = {
  posts: { id: number }[];
};

const Tranding = ({ posts }: TrandingProps) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Text className="text-3xl text-white">{item.id}</Text>
      )}
      horizontal
    />
  );
};

export default Tranding;
