import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import React, { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { colors, backgroundColors, textColors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";

export default function DashboardScreen() {
  const { auth } = useAuth(); // Get user object

  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch data on refresh
  const fetchData = async () => {
    console.log("pulled over the screen 🔥");
    setRefreshing(true);
    try {
      // 🔥 Replace this with your API call
      // const response = await fetch("https://yourapi.com/dashboard");
      // const data = await response.json();
      console.log("Fetched Data: 🔥",);
      // Update your state here if necessary
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setRefreshing(false);
  };


  return (
    
    <ScrollView contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} colors={[colors.primary]} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back,</Text>
        <Text style={styles.username}>Employee 1</Text>
      </View>

      {/* Widget Section */}
      <View style={styles.widgetContainer}>
        <DashboardWidget icon="bar-chart-outline" label="Total Earnings" value="₹ 50,000" />
        <DashboardWidget icon="people-outline" label="Team Members" value="12" />
        <DashboardWidget icon="briefcase-outline" label="Projects Assigned" value="8" />
        <DashboardWidget icon="checkmark-done-circle-outline" label="Tasks Completed" value="28" />
      </View>

      {/* Recent Activity Section */}
      <View style={styles.activityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <ActivityItem icon="document-text-outline" label="Submitted Report" time="2 hours ago" />
        <ActivityItem icon="chatbubble-ellipses-outline" label="New Message from HR" time="1 day ago" />
        <ActivityItem icon="calendar-outline" label="Upcoming Meeting" time="Tomorrow 10:00 AM" />
        <ActivityItem icon="calendar-outline" label="Upcoming Meeting" time="Tomorrow 10:00 AM" />
        <ActivityItem icon="calendar-outline" label="Upcoming Meeting" time="Tomorrow 10:00 AM" />
      </View>
    </ScrollView>
   
  );
}
// Reusable Widget Component
const DashboardWidget = ({ icon, label, value }) => (
  <View style={styles.widget}>
    <Ionicons name={icon} size={30} color={colors.primary} />
    <Text style={styles.widgetLabel}>{label}</Text>
    <Text style={styles.widgetValue}>{value}</Text>
  </View>
);

// Reusable Activity Component
const ActivityItem = ({ icon, label, time }) => (
  <View style={styles.activityItem}>
    <Ionicons name={icon} size={24} color={colors.primary} />
    <View style={styles.activityText}>
      <Text style={styles.activityLabel}>{label}</Text>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: backgroundColors.light, // Dark background
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingBottom: 100,  // Extra space for bottom tab
  },
  header: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 18,
    color: colors.primary,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
  },
  widgetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  widget: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
    marginBottom: 15,
  },
  widgetLabel: {
    fontSize: 14,
    color: textColors.secondary,
    marginTop: 5,
  },
  widgetValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 5,
  },
  activityContainer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  activityText: {
    marginLeft: 10,
  },
  activityLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: textColors.secondary,
  },
  activityTime: {
    fontSize: 14,
    color: textColors.gray,
  },
});