import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator, 
} from "react-native";
import axios from "axios";
import { RESP_URL } from "../config";

export default function SearchOrganization({ userId, token, onSelectOrg }) {
  const [organizations, setOrganizations] = useState([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${RESP_URL}/api/organization`, {
          params: { userId },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setOrganizations(response.data);
        setFilteredOrganizations(response.data); // Initially, all organizations are displayed
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        setError("Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [userId, token]);

  // Filter organizations based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = organizations.filter((org) =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOrganizations(filtered);
    } else {
      setFilteredOrganizations([]); // If no search query, show no results
    }
  }, [searchQuery, organizations]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar organización por nombre"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {filteredOrganizations.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          style={styles.listBg}
          data={filteredOrganizations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelectOrg(item._id)}
              style={({ pressed }) => [
                {
                  padding: 20,
                  backgroundColor: pressed ? "#ddd" : "#f5f5f5",
                  margin: 5,
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 8,
                },
                styles.itemContainer,
              ]}
            >
              <Image
                source={
                  item.image
                    ? { uri: `${RESP_URL}/${item.image}` }
                    : require("../assets/images/org_placeholder.jpg")
                }
                style={styles.image}
              />
              <Text>{item.name}</Text>
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.noResults}>No se encontraron organizaciones</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchInput: {
    width: "90%",
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  listBg: {
    // backgroundColor: "gray",
    width: "100%",
  },
  listContainer: {
    alignItems: "center",
  },
  itemContainer: {
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  noResults: {
    marginTop: 20,
    color: "red",
  },
});
