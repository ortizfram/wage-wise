import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext"; // Adjust the path as needed
import Spinnerr from "react-native-loading-spinner-overlay";

const organizations = [
  { id: "1", name: "Organization 1" },
  { id: "2", name: "Organization 2" },
  { id: "3", name: "Organization 3" },
];

export default function OrganizationList() {
  const { userInfo, isLoading } = useContext(AuthContext); // Fetch userInfo from context

  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
      return null;
    }
  }, []);
  const router = useRouter();

  const handleSelectOrg = (orgId) => {
    router.push(`/${orgId}/dashboard`);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Spinnerr visible={isLoading} />
      <Text style={styles.welcome}>Welcome {userInfo.email || ""}</Text>

      <Text>Elige tu Establecimiento</Text>
      <FlatList
        data={organizations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelectOrg(item.id)}
            style={({ pressed }) => [
              {
                padding: 20,
                backgroundColor: pressed ? "#ddd" : "#f5f5f5",
                margin: 5,
              },
              styles.itemContainer,
            ]}
          >
            <Text>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  selectText: {
    color: "#ffff",
    marginVertical: 15,
    fontSize: 32,
  },
  name: {
    color: "#ffff",
    fontWeight: "bold",
    fontSize: 20,
  },
  welcome: {
    marginTop: 15,
    color: "blue",
    fontSize: 20,
  },
  itemContainer: {
    borderRadius: 8,
  },
  org: {
    color: "blue",
    fontSize: 20,
  },
  link: {
    color: "blue",
  },
});
