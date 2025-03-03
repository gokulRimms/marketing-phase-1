import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Text } from "@/components/ui/text";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import { _LOGIN } from "../../utility/models/auth";
import { set, get, remove } from '../../utility/storage/Actions';
import { FIRE_TOAST } from "../../utility/helpers/toaster";
import { useToast } from "@/components/ui/toast";
const LoginPage = () => {

  const toast = useToast();

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // setValue("email", "employee1@yopmail.com");
  // setValue("password", "password");



  const onSubmit = async (data) => {

    console.log("Login data:", data);
    try {
      const response = await _LOGIN(data); //await axios.post(LOGIN_ENDPOINT, data);
      const { user, access_token } = response.data || {};
      if (user && access_token) {
        console.log('access_token', access_token);
        await remove('access_token');
        await remove('authenticated');

        await set('access_token', access_token);
        await set('authenticated', user);
        FIRE_TOAST(toast, "success", "solid", "Success", "Successfully logged in.");

        router.replace("/(tabs)/dashboard"); // Redirect on successful login
      }
    } catch (error) {
      FIRE_TOAST(toast, "error", "solid", "Failed", error?.response?.data?.message || "Failed to login.");
      console.log("Error Response:", error.response.data.message);
    }
  };

  const showNewToast = () => {
    const newId = Math.random()
    setToastId(newId)
    toast.show({
      id: newId,
      placement: "top",
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id
        return (
          <Toast nativeID={uniqueToastId} action="muted" variant="outline">
            <ToastTitle className="font-semibold text-success-500">Success</ToastTitle>
            <ToastDescription>
              Login successful
            </ToastDescription>
          </Toast>
        )
      },
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        {/* Floating Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Login</Text>

        {/* Email Field */}
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Enter a valid email",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}
            </View>
          )}
          name="email"
        />

        {/* Password Field */}
        <Controller
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#aaa"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>
          )}
          name="password"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    top: -40, // Half outside the card
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 10,
    elevation: 5, // For shadow effect
  },
  logo: {
    width: 60,
    height: 60,
    padding: 40,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 40, // Space for the logo
  },
  inputContainer: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    alignSelf: "center",
  },
  linkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginPage;