import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { RESP_URL } from "../../config";
import InOutClock from "../../components/InOutClock";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo._id) {
      const fetchOrganizations = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`${RESP_URL}/api/organization`, {
            params: { userId: userInfo._id },
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
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
    }
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
    }
  }, [userInfo]);

  const handleSelectOrg = (orgId) => {
    router.push(`/${orgId}/dashboard`);
  };

  if (authLoading || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Pressable style={styles.createBtn}>
          <Text
            style={styles.createText}
            onPress={() => {
              router.push("/organization/create");
            }}
          >
            (+) Create an Organization
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenido {userInfo?.email || ""}</Text>
      {userInfo?.isAdmin ? (
        <>
          {organizations.length > 0 ? (
            <>
              <Text style={styles.blue}>Elige tu Establecimiento, o</Text>
              <Pressable style={styles.createBtn}>
                <Text
                  style={styles.createText}
                  onPress={() => {
                    router.push("/organization/create");
                  }}
                >
                  (+) Crea otra organización
                </Text>
              </Pressable>
              <FlatList
                contentContainerStyle={styles.listContainer}
                style={styles.listBg}
                data={organizations}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelectOrg(item._id)}
                    style={({ pressed }) => [
                      {
                        padding: 20,
                        backgroundColor: pressed ? "#ddd" : "#f5f5f5",
                        margin: 5,
                        width: "100%", // Adjust to fit your design
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
                          : require("../../assets/images/org_placeholder.jpg")
                      }
                      style={styles.image}
                    />
                    <Text>{item.name}</Text>
                  </Pressable>
                )}
              />
            </>
          ) : (
            <View style={styles.container}>
              <Text>No organizations found for this account yet!</Text>
              <Pressable style={styles.createBtn}>
                <Text
                  style={styles.createText}
                  onPress={() => {
                    router.push("/organization/create");
                  }}
                >
                  (+) Create an Organization
                </Text>
              </Pressable>
            </View>
          )}
        </>
      ) : (
        <InOutClock />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: 16,
  },
  blue: {
    color: "blue",
  },
  listBg: {
    backgroundColor: "gray",
    width: "100%",
  },
  listContainer: {
    alignItems: "center", // Center items horizontally
  },
  welcome: {
    marginTop: 15,
    color: "blue",
    fontSize: 20,
  },
  image: {
    width: 50, // Adjust the size as needed
    height: 50, // Adjust the size as needed
    borderRadius: 8,
    marginRight: 15, // Space between image and text
  },
  itemContainer: {
    borderRadius: 8,
  },
  createBtn: {
    padding: 10,
    backgroundColor: "blue",
    marginVertical: 10,
  },
  createText: {
    color: "white",
  },
  pressed: {},
});
