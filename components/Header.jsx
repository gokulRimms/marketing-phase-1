import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import { useAuth } from "@/context/AuthContext";
import Notification from "./Notification";
export default function Header(props) {
  const router = useRouter();
  const { profile } = props;
  const title = props[0]?.options?.title || "";

  //authenticated user
  const { auth } = useAuth();
  const { user } = auth || {};

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 12,
          backgroundColor: colors.primary,
          position: "relative", // Required for absolute positioning of title
        }}
      >
        {/* Back Button */}
        {router.canGoBack() ? (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} /> // Placeholder to balance layout
        )}

        {/* Centered Title */}
        <View style={{ position: "absolute", left: 0, right: 0, alignItems: "center" }}>
          <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>{title}</Text>
        </View>

        {/* Right Section (Notification & Profile) */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Notification Icon */}
          <Notification user={user}/>

          {/* Profile Image */}
          {profile && (
            <TouchableOpacity onPress={() => router.push("/profile")}>
              {user && user.avatar ? (<Image
                source={{ uri: user.avatar }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              />) : (<Image
                source={{ uri: "https://picsum.photos/200/300" }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: "white",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              />)}


            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
