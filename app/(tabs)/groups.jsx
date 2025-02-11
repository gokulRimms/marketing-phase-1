import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl, Image, TextInput } from "react-native";
import { colors } from "../../constants/colors";
import { Feather } from '@expo/vector-icons';
import { _FETCH_GROUPS } from "../../utility/models/groups"; // API call for groups
import { FIRE_TOAST } from '../../utility/helpers/toaster';
import { useToast } from "@/components/ui/toast";
import * as SMS from 'expo-sms';

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // toast
  const toast = useToast(); // Get toast instance

  useEffect(() => {
    fetchGroupData();
  }, []);

  useEffect(() => {
    if (searchText === "") {
      setFilteredGroups(groups);
    } else {
      const filtered = groups.filter((group) =>
        group.name.toLowerCase().includes(searchText.toLowerCase()) ||
        group.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredGroups(filtered);
    }
  }, [searchText, groups]);

  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const response = await _FETCH_GROUPS();
      console.log("Fetched Groups:", response.data);
      setGroups(response.data);
      setFilteredGroups(response.data); // Initially, display all groups
    } catch (error) {
      console.log("Error fetching groups:", error);
      FIRE_TOAST(toast, "error", "solid", "Error!", "Failed to fetch groups.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroupData();
    setRefreshing(false);
  };

  const sendMessage = async (groupId) => {
    // Collect all phone numbers into an array
    // const phoneNumbers = contacts.map((contact) => contact.phone);
    const isAvailable = await SMS.isAvailableAsync();
    console.log('isAvailable', isAvailable);
    // if (isAvailable) {
    //   //// do your SMS stuff here
    // } else {
    //   // misfortune... there's no SMS available on this device
    // }
    const { result } = await SMS.sendSMSAsync(['8006584349', '7827258049', '9027956097'], 'Hello TEST Message');
    console.log('result', result);
    if (result === 'sent' || result === 'unknown') {
      console.log('api called');
      // Send history only if SMS is sent or unknown
      try {
        FIRE_TOAST(toast, "success", "solid", "Success!", "History Created...");

        // Alert.alert('History Created...');
        // const historySent = await axiosInstance.post(`/messages/${editMessage.id}/history`, {
        //   message_id: editMessage.id,
        //   group_id: selectedGroup,
        //   contacts: contacts.map((contact) => contact.id), // Ensure you are sending contact IDs correctly
        // });
        // console.log('historySent', historySent.data);
        // if (historySent.data.status) {

        //   Alert.alert('Message Sent successfully');
        // }
      } catch (error) {
        console.error('Error sending history:', error);
        FIRE_TOAST(toast, "error", "solid", "Info!", "Failed to send the message");
      }
    } else {
      FIRE_TOAST(toast, "error", "solid", "Info!", "SMS not sent. Result");
      console.log('SMS not sent. Result:', result);
    }

  };



  const renderGroupItem = ({ item }) => {
    // Extract employee names as a comma-separated list
    const employeeNames = item.assigned_users.map((user) => user.name).join(", ");

    return (
      <View style={styles.groupCard}>
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.name}</Text>
          <Text style={styles.groupDescription}>{item.description}</Text>
        </View>

        <View style={styles.templateInfo}>
          <Text style={styles.templateTitle}>Template: {item.template_name}</Text>
          <Text style={styles.templateMessage}>{item.template_message}</Text>
        </View>

        <View style={styles.assignedUserInfo}>
          <Text style={styles.assignedUserNames}>{employeeNames}</Text>
        </View>

        <View style={styles.historyContactsBox}>
          <View style={styles.historyBox}>
            <Text style={styles.historyCount}>Total {item.total_histories} Sent</Text>
          </View>
          <View style={[styles.historyBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.totalContacts}>{item.total_contacts} Contacts</Text>
          </View>
        </View>
        <View style={styles.historyContactsBox}>
          <View style={[styles.historyBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.historyCount}>Sent {item.total_sent_todays} Today</Text>
          </View>
          <View style={styles.contactsBox}>
            <Text style={styles.totalContacts}>{item.balance} Quota Left</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>

          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: item.disabled ? colors.gray : colors.primary, }]}
            onPress={() => {
              if (item.disabled) {
                FIRE_TOAST(toast, "error", "solid", "Notice!", "You've consumed all your messages for today.");
                return
              }
              sendMessage(item.id)
            }}
          // disabled={item.disabled}
          >
            <Feather name="send" size={20} color={colors.white} />
            <Text style={[styles.sendButtonText, { color: colors.white }]}>Send Message</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };



  return (
    <View style={styles.container}>
      {/* Search Filter */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Groups"
        value={searchText}
        onChangeText={setSearchText}
      />

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderGroupItem}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        />
      )}
    </View>
  );
};

export default GroupsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  searchInput: {
    height: 40,
    borderColor: colors.gray,
    margin: 10,
    borderBottomWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  groupCard: {
    flex: 1,
    padding: 15,
    margin: 10,
    // Bottom: 1,
    // borderColor: colors.gray,
    borderRadius: 2,
    elevation: 5,
    backgroundColor: colors.white,
    marginBottom: 15,
  },
  groupHeader: {
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  groupDescription: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 5,
  },
  templateInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  templateMessage: {
    fontSize: 12,
    color: colors.secondary,
  },
  assignedUserInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
  assignedUserNames: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 5,
  },
  historyContactsBox: {
    flexDirection: "row", // Row layout to align history and contacts on left and right
    justifyContent: "space-between", // Spread them out
    marginBottom: 10,
  },
  historyBox: {
    backgroundColor: colors.secondary, // Primary color background
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 5,
    borderRadius: 2,
    width: "48%", // To leave space for the contacts box
  },
  contactsBox: {
    backgroundColor: colors.secondary, // Secondary color background
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    elevation: 5,
    borderRadius: 2,
    width: "48%", // Same width as historyBox
  },
  historyCount: {
    fontSize: 12,
    color: colors.white, // White text to contrast the primary background
  },
  totalContacts: {
    fontSize: 12,
    color: colors.white, // White text to contrast the secondary background
  },
  sendButton: {
    flexDirection: "row",
    justifyContent: "center",
    width: "50%",
    alignItems: "center",
    paddingVertical: 10,
    elevation: 5,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginTop: 10,
  },
  sendButtonText: {
    fontWeight: "bold",
    marginLeft: 5,
  },
});
