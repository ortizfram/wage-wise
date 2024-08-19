import React from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RESP_URL } from "../../config";
import axios from "axios";

export default function Dashboard() {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();

  const deleteOrg = async () => {
    await axios
      .delete(`${RESP_URL}/api/organization/${orgId}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("org deleted");
          router.push("/");
        }
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Dashboard for Organization {orgId}</Text>
      <Pressable>
        <Text style={{ color: "red" }} onPress={deleteOrg}>
          Elimina esta organizacion
        </Text>
      </Pressable>
    </View>
  );
}
