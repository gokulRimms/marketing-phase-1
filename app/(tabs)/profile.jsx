import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/Loader";
import { backgroundColors, textColors, colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons"; // Icons
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { auth } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();

  if (!auth || !auth.user) {
    return <Loader size="large" color={colors.primary} />;
  }

  const { user } = auth;
  console.log('user.avatar', user.avatar);
  const handleLogout = async () => {
    await logout(); // Call logout function
    router.replace("/(auth)/login"); // Redirect to login
  };


  return (
    <View style={styles.container}>
      {/* Profile Header with Avatar */}
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role.toUpperCase()}</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.infoContainer}>
        <InfoRow icon="mail-outline" label="Email" value={user.email} />
        <InfoRow icon="call-outline" label="Phone" value={user.phone || "No phone added"} />
        <InfoRow icon="calendar-outline" label="Joined" value={user.created_at.split(" ")[0]} />
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={textColors.primary} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Reusable Component for Each Row
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoBox}>
    <Ionicons name={icon} size={22} color={colors.primary} style={styles.icon} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColors.light,
    alignItems: "center",
    paddingVertical: 30,
  },
  header: {
    width: "90%",
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  role: {
    fontSize: 16,
    color: textColors.highlight,
    fontWeight: "600",
    marginTop: 5,
  },
  infoContainer: {
    width: "90%",
    marginTop: 20,
  },
  infoBox: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  icon: {
    width: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.secondary,
    flex: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    textAlign: "right",
  },

  // 
  logoutContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#025c4a", // Your primary theme color
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

