import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CButton";
import { FC } from "react";

const EmptyState: FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        style={{width: 270, height: 216}}
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title="Back to Explore"
        handlePress={() => router.push("/home")}
        containerStyles="w-full mt-7 mb-7 bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center"
      />
    </View>
  );
};

export default EmptyState;
