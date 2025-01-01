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
import FormField from "@/components/FormField";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useVideoPlayer, VideoView } from "expo-video";
import { icons } from "@/constants";
import CustomButton from "@/components/CButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideoPost, uploadFile } from "@/lib/appwrite";

type DocumentPickerResult = {
  type: "success" | "cancel";
  name?: string; // File name
  size?: number; // File size in bytes
  uri?: string; // File URI
  mimeType?: string; // File MIME type
};

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    video: any;
    thumbnail: any;
    prompt: string;
  }>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const player = useVideoPlayer(form?.video, (player) => {
    player.loop = false;
  });

  const openPicker = async (
    selectType: "image" | "video"
  ): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type:
          selectType === "image"
            ? ["image/png", "image/jpeg"]
            : ["video/mp4", "video/gif"],
            copyToCacheDirectory: true,
      });
      // console.log(result)

    if (result.type !=='cancel' && result.assets && result.assets.length > 0) {
   
      ; 
      setForm((prevForm) => ({
        ...prevForm,
        [selectType === "image" ? "thumbnail" : "video"]: result.assets[0],
      }));

      } else {
        Alert.alert("File selection canceled", "No file was selected.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to select a file. Please try again.");
    }
  };
  

  const submit = async () => {
    if (
      form.prompt === "" ||
      form.title === "" ||
      !form.thumbnail ||
      !form.video
    ) {
      return Alert.alert("Incomplete field", "Please provide all fields");
    }


    setUploading(true);
    try {
      await createVideoPost({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Post uploaded successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", "An error occured");
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });

      setUploading(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 flex flex-col gap-3">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
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
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl border border-black-200 flex justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 flex flex-col gap-3">
          <Text className="text-base text-gray-100 font-pmedium ">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail?.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium ml-2">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The AI prompt of your video...."
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="w-full mt-7 bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
