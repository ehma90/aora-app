import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CButton";
import { Link, router } from "expo-router";
// import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { createUser } from "@/lib/appwrite";

const SignUp = () => {
  const {setUser, setIsLogged} = useGlobalContext()
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<{
    username: string;
    email: string;
    password: string;
  }>({
    username: "",
    email: "",
    password: "",
  });

  const submit = () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please fill in all the fiels");
      return
    }
    
    // createUser(form.email, form.password, form.username);
    setSubmitting(true);
    try {
      const result = createUser(form.email, form.password, form.username);
      setIsLogged(true)
      setUser(result)
      // global state
      router.replace("/home");
    } catch (error) {
      Alert.alert(
        "Error",
        typeof error === "string" ? error : "An error occured"
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center min-h-[85vh] px-4 my-6"
          style={
            {
              // minHeight: Dimensions.get("window").height - 100,
            }
          }
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px] mx-auto"
          />

          <Text className="text-2xl font-semibold text-white mt-8 font-psemibold text-center">
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="w-full mt-7 bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign-in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
