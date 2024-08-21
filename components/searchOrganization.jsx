import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet, Image, ActivityIndicator } from "react-native";
import axios from "axios";
import { RESP_URL } from "../config";

export default function SearchOrganization({ userId, token, organizationId, onSelectOrg }) {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const params = organizationId ? { userId } : {}; // Query with userId if organizationId exists
        const response = await axios.get(`${RESP_URL}/api/organization`, {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setOrganizations(response.data);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        setError("Failed to fetch organizations");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, [userId, token, organizationId]);

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
    <FlatList
      contentContainerStyle={styles.listContainer}
      style={styles.listBg}
      data={organizations}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listBg: {
    backgroundColor: "gray",
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
});
