import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const organizations = [
  { id: "1", name: "Organization 1" },
  { id: "2", name: "Organization 2" },
  { id: "3", name: "Organization 3" },
];

export default function OrganizationList() {
  const router = useRouter();

  const handleSelectOrg = (orgId) => {
    router.push(`/${orgId}/dashboard`);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Elige tu Establecimiento</Text>
      <FlatList
        data={organizations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectOrg(item.id)}
            style={{ padding: 20, backgroundColor: "#f5f5f5", margin: 5 }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
