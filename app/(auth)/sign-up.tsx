import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setSubmitting] = useState(false);
  const { setUser, setIsLogged } = useGlobalContext();

  const handleSubmit = async () => {
    // TODO: Implement sign in functionality
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all fields");
    }

    setSubmitting(true);

    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image
            className="w-[115px] h-[35px]"
            resizeMode="contain"
            source={images.logo}
          />
          <Text className="text-semibold  font-psemibold text-white font-bold text-2xl mt-10">
            Sign up to Shovi
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(u: string) => setForm({ ...form, username: u })}
            otherStyles="mt-7"
            placeholder="Enter your username"
            // keyboardType="email-address"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            placeholder="Enter your email"
            // keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(p: string) => setForm({ ...form, password: p })}
            otherStyles="mt-10"
            placeholder="Enter your password"
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles="w-full mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg text-secondary font-psemibold"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
