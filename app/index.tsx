import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";


const index = () => {
  return (
    <View className="flex-1 flex justify-center items-center">
      <Text className="text-4xl">index</Text>
      <StatusBar style="auto" />

      <Link
        href="./profile"
        className="text-blue-500"
      >
        {" "}
        Go to profile
      </Link>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
