import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { colors, backgroundColors, textColors } from "@/constants/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import {_FETCH_DASHBOARD} from '../../utility/models/dashboard'
export default function DashboardScreen() {
  const { auth } = useAuth(); // Get user object
  const { user } = auth || {};

  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  // Function to fetch data on refresh

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("pulled over the screen 🔥");
    setRefreshing(true);
    try {
      await _FETCH_DASHBOARD().then((response) => {
        setDashboardData(response.data);
      })
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
        <Text style={styles.username}>{user?.name}</Text>
      </View>
      {/* <View style={[styles.activityContainer, { marginBottom: 20}]}>
        <ActivityItem icon="logo-capacitor" label="80" time="Total Capacity" />
        <ActivityItem icon="chatbubble-ellipses-outline" label={dashboardData.todays_sent + " Messages"} time="Sent Today" />
      </View> */}
      
      {/* Widget Section */}
      <View style={styles.widgetContainer}>
      <DashboardWidget icon="doubleright" label="Total Capacity" value="80" />
      <DashboardWidget icon="wechat" label="Capacity Left" value={80-dashboardData.todays_sent} />

        <DashboardWidget icon="team" label="Groups" value={dashboardData.groups} />
        <DashboardWidget icon="contacts" label="Contacts" value={dashboardData.contacts} />
        <DashboardWidget icon="message1" label="Total Sent" value={dashboardData.sent} />
        <DashboardWidget icon="clockcircleo" label="Todays Sent" value={`${dashboardData.todays_sent}`} />
        <DashboardWidget icon="book" label="Total Leads" value={`${dashboardData.total_leads}`} />
        <DashboardWidget icon="save" label="Todays Leads" value={`${dashboardData.today_leads}`} />

      </View>

      {/* Recent Activity Section */}
      <View style={styles.activityContainer}>
        {/* <Text style={styles.sectionTitle}>Recent Activity</Text> */}
        {/* <ActivityItem icon="bag-check-outline" label={dashboardData.total_leads} time="Total Leads" />
        <ActivityItem icon="bag-add-outline" label={dashboardData.today_leads} time="New Leads" /> */}
      </View>
    </ScrollView>
   
  );
}
// Reusable Widget Component
const DashboardWidget = ({ icon, label, value }) => (
  <View style={styles.widget}>
    <AntDesign name={icon} size={30} color={colors.primary} />
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