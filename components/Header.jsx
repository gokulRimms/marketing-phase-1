import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '../constants/colors';

export default function Header({ title, profile }) {
  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: colors.primary }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 6,
          marginBottom: 10,
          paddingHorizontal: 8,
          backgroundColor: colors.primary,
        }}
      >
        {/* Back Button */}
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Title (Centered) */}
        <Text
          style={{
            fontSize: 18,
            color: "white",
            fontWeight: "bold",
            flex: 1,
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        {profile && (
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <Image
              source={{
                uri: "https://picsum.photos/200/300",
              }}
              style={{ width: 40, height: 40, borderRadius: 20, }}
            />
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}