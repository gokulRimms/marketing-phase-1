import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, Button, Alert, ActivityIndicator, StyleSheet, RefreshControl } from "react-native";
import { colors } from "../../constants/colors";
import { _FETCH_LEADS, _ADD_LEAD } from "../../utility/models/leads"; // API calls
import { _FETCH_GROUPS } from '../../utility/models/groups';
import {
    Select,
    SelectTrigger,
    SelectInput,
    SelectIcon,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectDragIndicator,
    SelectDragIndicatorWrapper,
    SelectItem,
} from "@/components/ui/select"
import { ChevronDownIcon } from "@/components/ui/icon"
import { TouchableOpacity } from "react-native";

const LeadsScreen = () => {
    const [leads, setLeads] = useState([]);
    const [filteredLeads, setFilteredLeads] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");
    const [searchText, setSearchText] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [groupOptions, setGroupOptions] = useState([]);


    useEffect(() => {
        fetchLeadsData(page);
    }, [page]);

    useEffect(() => {
        if (searchText === "") {
            setFilteredLeads(leads);
        } else {
            const filtered = leads.filter((lead) =>
                lead.group_name.toLowerCase().includes(searchText.toLowerCase()) ||
                lead.contact.toLowerCase().includes(searchText.toLowerCase()) ||
                lead.description.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredLeads(filtered);
        }
    }, [searchText, leads]);
    // 
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await _FETCH_GROUPS(); // Replace with your API function
                setGroupOptions(response.data);
            } catch (error) {
                Alert.alert("Error", "Failed to fetch groups");
            }
        };
        fetchGroups();
    }, []);

    const fetchLeadsData = async (pageNumber) => {
        if (isFetching) return;
        setIsFetching(true);
        try {
            setLoading(true);
            const response = await _FETCH_LEADS(pageNumber);
            console.log("Fetched Leads:", response.data);

            if (pageNumber === 1) {
                setLeads(response.data);
                setFilteredLeads(response.data);
            } else {
                const newLeads = response.data.filter(
                    (newItem) => !leads.some((existingItem) => existingItem.id === newItem.id)
                );
                setLeads((prevLeads) => [...prevLeads, ...newLeads]);
                setFilteredLeads((prevLeads) => [...prevLeads, ...newLeads]);
            }

            setTotal(response.pagination.total);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch leads");
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchLeadsData(1);
        setRefreshing(false);
    };

    const loadMoreLeads = () => {
        if (!loading && !isFetching && page < Math.ceil(total / 10)) {
            setPage(page + 1);
        }
    };

    const addLead = async () => {
        if (!groupName || !contact || !description) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            const newLead = { group_name: groupName, contact, description };
            const response = await _ADD_LEAD(newLead);

            if (response.success) {
                Alert.alert("Success", "Lead added successfully!");
                setLeads([response.data, ...leads]);
                setFilteredLeads([response.data, ...filteredLeads]);
                setGroupName("");
                setContact("");
                setDescription("");
            } else {
                Alert.alert("Error", response.message);
            }
        } catch (error) {
            Alert.alert("Error", "Failed to add lead");
        } finally {
            setLoading(false);
        }
    };

    const renderLeadItem = ({ item }) => (
        <View style={styles.leadCard}>
            <Text style={styles.leadTitle}>Group: {item.group_name}</Text>
            <Text style={styles.leadContact}>Contact: {item.contact}</Text>
            <Text style={styles.leadDescription}>Description: {item.description}</Text>
        </View>
    );
    return (
        <View style={styles.container}>
            {/* Form */}
            <TextInput style={styles.input} placeholder="Contact" value={contact} onChangeText={setContact} />
            <View style={{ marginBottom: 10 }}>
                <Select value={groupName} onValueChange={setGroupName} variant="solid" size="xl">
                    <SelectTrigger className='h-12 border-0' style={{ borderBottomWidth: 1, borderColor: colors.gray }}>
                        <SelectInput className='h-12 text-lg' placeholder="Select Group Name" />
                        <SelectIcon>
                            <ChevronDownIcon />
                        </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                            <SelectDragIndicatorWrapper>
                                <SelectDragIndicator />
                            </SelectDragIndicatorWrapper>
                            {groupOptions && groupOptions.map((group, index) => (
                                <SelectItem key={index} label={group.name} value={group.id} />
                            ))}
                        </SelectContent>
                    </SelectPortal>
                </Select>
            </View>

            <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />

            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 10, elevation: 4 }} onPress={() => addLead()}>
                    <Text style={{ color: colors.white }}>Add Lead</Text>
                </TouchableOpacity>
            </View>
            {/* Search */}


            {total && total > 0 && (
                <>
                    <TextInput style={styles.searchInput} placeholder="Search Leads" value={searchText} onChangeText={setSearchText} />
                    <Text style={styles.totalText}>Total: {total}</Text>
                </>
            )}

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} />
            ) : (
                <FlatList
                    data={filteredLeads}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={renderLeadItem}
                    numColumns={1}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
                    onEndReached={loadMoreLeads}
                    onEndReachedThreshold={0.5}
                />
            )}
        </View>
    );
};

export default LeadsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    input: {
        height: 40,
        borderColor: '#eee',
        borderBottomWidth: 1,
        borderRadius: 2,
        paddingLeft: 10,
        marginBottom: 10,
        fontSize: 16,
    },
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
    leadCard: {
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
    leadTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text,
    },
    leadContact: {
        fontSize: 14,
        color: colors.secondary,
    },
    leadDescription: {
        fontSize: 12,
        color: colors.secondary,
    },
    totalText: {
        fontSize: 16,
        fontWeight: "bold",
        color: colors.text,
        marginBottom: 10,
    },
});
