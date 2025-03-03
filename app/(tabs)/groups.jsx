import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl, Image, TextInput } from "react-native";
import { colors } from "../../constants/colors";
import { Feather } from '@expo/vector-icons';
import { _FETCH_GROUPS, _FETCH_GROUP_CONTACTS } from "../../utility/models/groups"; // API call for groups
import { _CREATE_HISTORY } from '../../utility/models/history';
import { FIRE_TOAST } from '../../utility/helpers/toaster';
import { useToast } from "@/components/ui/toast";
import * as SMS from 'expo-sms';
import Loader from "../../components/Loader";

const GroupsScreen = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  //
  const [sendingContacts, setSendingContacts] = useState([]);
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

  const sendMessage = async (groupId, balance, template_message) => {
    setLoading(true);
    const request = await _FETCH_GROUP_CONTACTS(groupId, balance);
    setLoading(false);
    const { contacts } = request.data || {};
    // console.log('contacts', contacts.length);
    setSendingContacts(contacts);

    const formattedNumbers = contacts.map((contact) => contact.phone);


    // return;
    const isAvailable = await SMS.isAvailableAsync();
    console.log('isAvailable', isAvailable);
    console.log('formattedNumbers', formattedNumbers);

    if (formattedNumbers.length === 0) {
      FIRE_TOAST(toast, "error", "solid", "Error!", "No contacts to send message.");
      return
    }

    // if (isAvailable) {
    //   //// do your SMS stuff here
    // } else {
    //   // misfortune... there's no SMS available on this device
    // }
    //['8006584349', '7827258049', '9027956097']
    const { result } = await SMS.sendSMSAsync(formattedNumbers, template_message);
    console.log('result', result);
    if (result === 'sent' || result === 'unknown') {
      console.log('api called');
      // Send history only if SMS is sent or unknown
      try {

        const createHistory = await _CREATE_HISTORY(groupId, contacts.map((contact) => contact.id)).then((response) => {
          FIRE_TOAST(toast, "success", "solid", "Success!", "History Created...");
          fetchGroupData();
          setSendingContacts([]);
          return
        }).catch((error) => {
          console.log('error', error);
          FIRE_TOAST(toast, "error", "solid", "Error!", "Failed to create history.");
          return
        });


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
    const employeeNames = item.total_assigned_users > 1 ? `Me & ${item.total_assigned_users - 1} Others` : 'Me';

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

          {/* <View style={styles.imageGroup}>
            {item.assigned_users.slice(0,3).map((user, index) => (
              <Image
                key={index}
                source={{ uri: user.avatar }}  // Assuming profile picture is available in user object
                style={[styles.profileImage, index > 0 && { marginLeft: -10 }]}  // Adjust margin for images next to each other
              />
            ))}
            {item.assigned_users.length > 3 && (
              <Text style={styles.moreUsers}>+{item.assigned_users.length - 3} More</Text>
            )}
          </View> */}
        </View>


        <View style={styles.historyContactsBox}>
          <View style={styles.historyBox}>
            <Text style={styles.historyCount}>Total {item.total_sent_by_all} Sent</Text>
          </View>
          <View style={[styles.historyBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.totalContacts}>{item.total_sent_by_me} / {item.total_contacts} Sent by me</Text>
          </View>
        </View>
        <View style={styles.historyContactsBox}>
          <View style={[styles.historyBox, { backgroundColor: colors.primary }]}>
            <Text style={styles.historyCount}>Total {item.contact_without_history} Left</Text>
          </View>
          <View style={styles.contactsBox}>
            <Text style={styles.totalContacts}>{item.balance} Today Quota Left</Text>
          </View>
        </View>

        <View style={{ alignItems: 'center' }}>

          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: item.disabled ? colors.gray : colors.primary, }]}
            onPress={() => {
              setLoading(true);
              
              if (item.disabled) {
                FIRE_TOAST(toast, "error", "solid", "Notice!", "You've consumed all your messages for today.");
                setLoading(false); // Reset loading state after toast
                return; // Exit early since the condition is met
              }

              if (item.contact_without_history > 0) {
                sendMessage(item.id, item.balance, item.template_message);
              } else {
                FIRE_TOAST(toast, "warning", "solid", "Warning!", "All contacts have been sent.");
              }

              setLoading(false); // Reset loading state after the logic completes
            }}
          // disabled={true}
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
        <Loader size="large" color={colors.primary} />
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
    flexDirection: 'row',
    alignItems: 'center',

  },

  imageGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gray',
  },
  moreUsers: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 5,
  },
  assignedUserNames: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
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
