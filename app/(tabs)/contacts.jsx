import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl, TextInput } from "react-native";
import { colors } from "../../constants/colors";
import { Feather } from '@expo/vector-icons';
import { _FETCH_CONTACTS } from "../../utility/models/contacts"; // API call for contacts

const ContactsScreen = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchContactData(page);
  }, [page]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.phone.toLowerCase().includes(searchText.toLowerCase()) ||
        contact.cr_number.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [searchText, contacts]);

  const fetchContactData = async (pageNumber) => {
    try {
      setLoading(true);
      const response = await _FETCH_CONTACTS(pageNumber);
      // console.log("Fetched Contacts:", );
      setTotal(response.pagination.total);
      setContacts((prevContacts) => [...prevContacts, ...response.data]);
      setFilteredContacts((prevContacts) => [...prevContacts, ...response.data]);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1); // Reset page when refreshing
    fetchContactData(1);
    setRefreshing(false);
  };

  const loadMoreContacts = () => {
    if (!loading) {
      setPage(page + 1); // Increment page for pagination
    }
  };

  const sendMessage = (contactId) => {
    // Placeholder function to handle send action
    Alert.alert("Send", `Sending message to contact with ID: ${contactId}`);
  };

  const renderContactItem = ({ item }) => {
    return (
      <View style={styles.contactCard}>
        <View style={styles.contactHeader}>
          <Text style={styles.contactName}>{item.name} ({item.gender})</Text>
          <Text style={styles.contactDetails}>
            {/* CR Number: {item.cr_number} | */}
             Age: {item.age} 
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Phone: {item.phone}</Text>
          {/* <Text style={styles.contactLabel}>Department: {item.department}</Text>
          <Text style={styles.contactLabel}>Year: {item.year}</Text> */}
          {item.address && <Text style={styles.contactLabel}>Address: {item.address}</Text>}
        </View>

        {/* <View style={styles.contactActions}>
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={() => sendMessage(item.id)}
          >
            <Feather name="send" size={20} color={colors.white} />
            <Text style={[styles.sendButtonText, { color: colors.white }]}>Send Message</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Filter */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Contacts"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text, margin: 10,}}>Total Contacts: {total}</Text>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item, index) => `${item.id}-${index}`}  // Unique key combining `id` and `cr_number`
          renderItem={renderContactItem}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          onEndReached={loadMoreContacts}
          onEndReachedThreshold={0.5} // Load more when the end is near
        />
      )}
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  searchInput: {
    height: 40,
    borderColor: colors.gray,
    margin: 10,
    borderWidth: 1,
    borderRadius: 2,
    paddingLeft: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  contactCard: {
    flex: 1,
    padding: 15,
    margin: 10,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 2,
    elevation: 5,
    backgroundColor: colors.white,
    marginBottom: 15,
  },
  contactHeader: {
    marginBottom: 10,
  },
  contactName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  contactDetails: {
    fontSize: 14,
    color: colors.secondary,
    marginTop: 5,
  },
  contactInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  contactActions: {
    marginTop: 10,
    alignItems: "center",
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
