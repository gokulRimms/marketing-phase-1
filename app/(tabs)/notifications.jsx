import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { colors } from "../../constants/colors";
import {
  _FETCH_NOTIFICATIONS, _MARK_AS_READ, _CLEAR_NOTIFICATIONS, _DELETE_NOTIFICATION,
  _READALL_NOTIFICATIONS
} from "../../utility/models/notifications";
import { TIME_AGO } from '../../utility/helpers/Carbon';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationsScreen = () => {
  const [selectedTab, setSelectedTab] = useState("unread");
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications(selectedTab);
  }, [selectedTab]);

  const fetchNotifications = async (selectedTab) => {
    try {
      setLoading(true);
      const response = await _FETCH_NOTIFICATIONS(selectedTab);
      setNotifications(response.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await _MARK_AS_READ(id);
      fetchNotifications(selectedTab);
    } catch (error) {
      Alert.alert("Error", "Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await _DELETE_NOTIFICATION(id);
      fetchNotifications(selectedTab);
    } catch (error) {
      Alert.alert("Error", "Failed to delete notification");
    }
  };

  const clearAllNotifications = async () => {
    try {
      await _CLEAR_NOTIFICATIONS();
      fetchNotifications(selectedTab);
      Alert.alert("Success", "All notifications cleared");
    } catch (error) {
      Alert.alert("Error", "Failed to clear notifications");
    }
  };

  const readAllNotifications = async () => {
    try {
      await _READALL_NOTIFICATIONS();
      fetchNotifications(selectedTab);
      Alert.alert("Success", "All notifications read");
    } catch (error) {
      Alert.alert("Error", "Failed to mark all as read");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications(selectedTab);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Tabs Section */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "unread" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setSelectedTab("unread")}
        >
          <Feather name="bell" size={26} color={selectedTab === "unread" ? colors.primary : colors.secondary} />
          <Text style={[styles.tabText, selectedTab === "unread" && styles.activeTabText]}>Unread</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "read" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setSelectedTab("read")}
        >
          <Feather name="bell-off" size={26} color={selectedTab === "read" ? colors.primary : colors.secondary} />
          <Text style={[styles.tabText, selectedTab === "read" && styles.activeTabText]}>Read</Text>
        </TouchableOpacity>
      </View>

      {/* List Section */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.notificationCard}>
              <View style={styles.notificationContent}>
              <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5,color: colors.secondary }}>{item?.data?.title}</Text>
                <Text style={styles.messageText}>{item?.data?.message || item.data.body}</Text>
                <Text style={styles.timestampText}>{TIME_AGO(item?.created_at)}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                {selectedTab === "unread" && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => markAsRead(item.id)}
                  >
                    <Feather name="eye-off" size={18} color={colors.primary} />
                  </TouchableOpacity>
                )}
                {selectedTab === "read" && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteNotification(item.id)}
                  >
                    <MaterialIcons name="auto-delete" size={20} color={colors.danger} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }} // Prevents list from being hidden by bottom navigation
          initialNumToRender={10} // Rendering first 10 items for better performance
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        />
      )}

      {/* Clear All Button */}
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 100 }}>
        {selectedTab === "unread" && (
          <TouchableOpacity
            onPress={readAllNotifications}
            style={[styles.clearAll, { borderColor: colors.primary, borderWidth: 1 }]}
          >
            <MaterialIcons name="auto-delete" size={24} color={colors.primary} />
            <Text style={[styles.clearAllText, { color: colors.primary }]}>Read All</Text>
          </TouchableOpacity>
        )}

        {selectedTab === "read" && (
          <TouchableOpacity
            onPress={clearAllNotifications}
            style={[styles.clearAll, { borderColor: colors.danger, borderWidth: 1 }]}
          >
            <MaterialIcons name="auto-delete" size={24} color={colors.danger} />
            <Text style={[styles.clearAllText, { color: colors.danger }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  tabs: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  tab: { paddingVertical: 12, flex: 1, alignItems: "center", borderBottomWidth: 3 },
  activeTab: { borderBottomColor: colors.primary },
  inactiveTab: { borderBottomColor: colors.secondary },
  tabText: { fontSize: 16, fontWeight: "bold", color: colors.secondary },
  activeTabText: { color: colors.primary },
  notificationCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  notificationContent: { flex: 1 },
  messageText: { fontSize: 12, color: colors.gray, fontWeight: "bold" },
  timestampText: { fontSize: 10, color: colors.secondary, marginTop: 5 },
  actionButtons: { flexDirection: "row" },
  actionButton: {
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  deleteButton: {
    borderColor: colors.danger,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  clearAll: {
    width: 100,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
  },
  clearAllText: { fontSize: 12, fontWeight: "normal", marginLeft: 5 },
});
