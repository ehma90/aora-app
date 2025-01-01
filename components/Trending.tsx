import { useEffect, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import * as Animatable from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { icons } from "../constants";

// Define animations with proper types
const zoomIn: Animatable.CustomAnimation<any> = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1,
  },
};

const zoomOut: Animatable.CustomAnimation<any> = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.8,
  },
};

// Register the animations
Animatable.initializeRegistryWithDefinitions({
  zoomIn,
  zoomOut,
});

const TrendingItem = ({ activeItem, item }: { activeItem: any; item: any }) => {
  const [play, setPlay] = useState<boolean>(false);
  
  const testVideoURL = "https://youtu.be/t7M8cWuLLB0";


  const player = useVideoPlayer(testVideoURL, (player) => {
    player.loop = true;
    player.play();
  });

  

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <VideoView
          style={{
            width: 300,
            height: 275,
            borderRadius: 33,
            backgroundColor: "white",
            opacity: 10,
          }}
          //   className="w-52 h-72 rounded-[33px] mt-3 bg-white/10"
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            style={{
              width: 220,
              height: 280,
              borderRadius: 33,
              marginTop: 20,
              overflow: "hidden",
              shadowOpacity: 30,
              boxShadow: "20px",
              opacity: 40,
            }}
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            style={{ width: 48, height: 48, position: "absolute" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }: { posts: any[] }) => {
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }: { viewableItems: any }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170, y: 0 }}
    />
  );
};

export default Trending;
