import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { colors, backgroundColors, textColors } from "@/constants/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Loader from "../../components/Loader";
import { _FETCH_DASHBOARD } from '../../utility/models/dashboard';

export default function DashboardScreen() {
  const { auth } = useAuth();
  const { user } = auth || {};

  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log("Fetching dashboard data... 🔥");
    setRefreshing(true);
    try {
      const response = await _FETCH_DASHBOARD();
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} colors={[colors.primary]} />}
    >
      {/* Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back,</Text>
        <Text style={styles.username}>{user?.name || "User"}</Text>
      </View>

       {/* Small Widgets */}
       <View style={styles.widgetContainer}>
        <DashboardWidget icon="doubleright" label="Total Capacity" value={ 80} />
        <DashboardWidget icon="doubleright" label="Total Capacity Left" value={80- dashboardData.todays_sent} />
      </View>

      {/* Full-width Dashboard Card */}
      {dashboardData && dashboardData.groups && dashboardData.groups.map((group, index) => (
        <View style={styles.fullWidthCard} key={index}>
          <Text style={styles.cardTitle}>{group.name}</Text>
          <View style={styles.cardRow}>
            <CardItem label="Total Contacts" value={group.total_contacts} />
            <CardItem label="Total Sent" value={group.total_sent_by_all} />
          </View>
          <View style={styles.cardRow}>
            <CardItem label="Sent by Me" value={group.total_sent_by_me} />
            <CardItem label="Total Left" value={group.contact_without_history} />
          </View>
          <View style={styles.cardRow}>
            <CardItem label="Leads" value={group.leads} />
            <CardItem label="Today’s Sent" value={group.total_sent_todays} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

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

// Small Widget Component
const DashboardWidget = ({ icon, label, value }) => (
  <View style={styles.widget}>
    <AntDesign name={icon} size={30} color={colors.white} />
    <Text style={styles.widgetLabel}>{label}</Text>
    <Text style={styles.widgetValue}>{value}</Text>
  </View>
);

// Card Item Component (for full-width card)
const CardItem = ({ label, value }) => (
  <View style={styles.cardItem}>
    <Text style={styles.cardLabel}>{label}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: backgroundColors.light,
    paddingVertical: 20,
    paddingHorizontal: 15,
    paddingBottom: 100,
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

  // Full-width card styles
  fullWidthCard: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardItem: {
    flex: 1,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },

  // Widget Styles
  widgetContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  widget: {
    width: "48%",
    backgroundColor: colors.primary,
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
    fontWeight : 'bold',
    color: colors.white,
    marginTop: 5,
  },
  widgetValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.white,
    marginTop: 5,
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
  activityContainer: {
    marginTop: 20,
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

