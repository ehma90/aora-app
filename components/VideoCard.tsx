import { FC, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants";
import { VideoView, useVideoPlayer } from "expo-video";

type VideoCardProps = {
  title: string;
  creator: any;
  avatar: any;
  thumbnail: any;
  video: any;
};

const VideoCard: FC<VideoCardProps> = ({
  title,
  creator,
  avatar,
  thumbnail,
  video,
}) => {
  const [play, setPlay] = useState<boolean>(false);

  const player = useVideoPlayer(video, (player) => {
    console.log("Player initialized:", player);
    player.loop = true;
    player.play();
  });

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-center">
        <View className="flex justify-center items-center flex-row gap-5 flex-1">
          <View
            style={{
              width: 46,
              height: 46,
              borderColor: "#ff9c01",
              borderWidth: 2,
              borderRadius: 8,
              padding: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: 8,
            }}
          >
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              style={{ width: "100%", height: "100%", borderRadius: 5 }}
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>
        <View className="pt-2">
          <Image
            source={icons.menu}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        </View>
      </View>
      {play ? (
        <VideoView
          style={{
            width: "100%",
            height: 240,
            borderRadius: 33,
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          style={{
            height: 180,
            position: "relative",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
          // className="w-full h-40 rounded-xl mt-3 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
              marginTop: 12,
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
    </View>
  );
};

export default VideoCard;
