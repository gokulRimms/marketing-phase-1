import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from '../constants/colors';

export default function Header(props) {
  const router = useRouter();
  const { profile } = props;
  const title = props[0].options.title || "";
  // console.log('router from props', props[0].options.title);
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
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "white",

                // Shadow for iOS
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 4,

                // Elevation for Android
                elevation: 5,
              }}
            />
          </TouchableOpacity>
        )}

      </View>
    </SafeAreaView>
  );
}