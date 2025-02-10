import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Alert, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { colors } from "../../constants/colors";
import { _FETCH_HISTORIES } from "../../utility/models/contacts"; // API call for histories

const HistoriesScreen = () => {
  const [histories, setHistories] = useState([]);
  const [filteredHistories, setFilteredHistories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false); // Flag to prevent multiple simultaneous fetches

  useEffect(() => {
    fetchHistoryData(page);
  }, [page]);

  useEffect(() => {
    if (searchText === "") {
      setFilteredHistories(histories);
    } else {
      const filtered = histories.filter((history) =>
        history.sent_by.toLowerCase().includes(searchText.toLowerCase()) ||
        history.group_name.toLowerCase().includes(searchText.toLowerCase()) ||
        history.contact_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredHistories(filtered);
    }
  }, [searchText, histories]);

  const fetchHistoryData = async (pageNumber) => {
    if (isFetching) return; // Prevent fetching if already in progress
    setIsFetching(true); // Mark as fetching
    try {
      setLoading(true);
      const response = await _FETCH_HISTORIES(pageNumber);
      console.log("Fetched Histories:", response.data);

      if (pageNumber === 1) {
        // Reset the data when refreshing or fetching the first page
        setHistories(response.data);
        setFilteredHistories(response.data);
      } else {
        // Only append new data if it's not already in the list
        const newHistories = response.data.filter(
          (newItem) => !histories.some((existingItem) => existingItem.id === newItem.id)
        );
        setHistories((prevHistories) => [...prevHistories, ...newHistories]);
        setFilteredHistories((prevHistories) => [...prevHistories, ...newHistories]);
      }

      setTotal(response.pagination.total);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch histories");
    } finally {
      setLoading(false);
      setIsFetching(false); // Mark as not fetching after data is loaded
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1); // Reset page when refreshing
    fetchHistoryData(1);
    setRefreshing(false);
  };

  const loadMoreHistories = () => {
    if (!loading && !isFetching && page < Math.ceil(total / 10)) {
      setPage(page + 1); // Increment page if more data is available
    }
  };

  const renderHistoryItem = ({ item }) => {
    const formattedTime = new Date(item.created_at).toLocaleString(); // Format the time

    return (
      <View style={styles.historyCard}>
        <View style={styles.historyHeader}>
          <Text style={styles.historySentBy}>Sent By: {item.sent_by}</Text>
          <Text style={styles.historyGroupName}>Group: {item.group_name}</Text>
        </View>

        <View style={styles.historyInfo}>
          <Text style={styles.historyTemplateTitle}>Template: {item.template_name}</Text>
          <Text style={styles.historyContactName}>Contact: {item.contact_name}</Text>
        </View>

        <Text style={styles.historyTime}>Time: {formattedTime}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Filter */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Histories"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text, margin: 10, }}>Total: {total}</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={filteredHistories}
          keyExtractor={(item, index) => `${item.id}-${index}`} // Unique key combining `id` and `index`
          renderItem={renderHistoryItem}
          numColumns={1}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
          onEndReached={loadMoreHistories}
          onEndReachedThreshold={0.5} // Load more when the end is near
        />
      )}
    </View>
  );
};

export default HistoriesScreen;

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
  historyCard: {
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
  historyHeader: {
    marginBottom: 10,
  },
  historySentBy: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  historyGroupName: {
    fontSize: 14,
    color: colors.secondary,
  },
  historyInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
  historyTemplateTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
  },
  historyContactName: {
    fontSize: 12,
    color: colors.secondary,
  },
  historyTime: {
    fontSize: 12,
    color: colors.text,
    marginTop: 10,
  },
});
