import {
  View,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  StyleSheet,
} from "react-native";
import React, { FC, useState } from "react";
import { Post } from "../../lib/appwrite";
import { icons } from "../../constants";
import * as Animatable from "react-native-animatable";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEvent } from "expo";

type TrandingProps = {
  posts: Post[];
};

type TrandingItemProps = {
  activeItem: string;
  item: Post;
};

const zoomIn = {
  0: {
    scale: 0.9,
    opacity: 1,
  },
  1: {
    scale: 1,
    opacity: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
    opacity: 1,
  },
  1: {
    scale: 0.9,
    opacity: 1,
  },
};

const TrandingItem: FC<TrandingItemProps> = ({ activeItem, item }) => {
  const player = useVideoPlayer(item.video, (player) => {
    player.loop = true;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item?.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {isPlaying ? (
        <View className="w-52 h-72 rounded-[35px] mt-3 bg-white/10 overflow-hidden">
          <VideoView className="" player={player}>
            <View className="w-52 h-72"></View>
          </VideoView>
        </View>
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          onPress={() => player.play()}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Tranding: FC<TrandingProps> = ({ posts }) => {
  const [avtiveItem, setActiveItem] = useState<string>(posts[1]?.$id);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item?.$id}
      renderItem={({ item }) => (
        <TrandingItem activeItem={avtiveItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      contentOffset={{ x: 170, y: 0 }}
      horizontal
    />
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  video: {
    width: 275,
    height: 350,
  },
  controlsContainer: {
    padding: 10,
  },
});

export default Tranding;
