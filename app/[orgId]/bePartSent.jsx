import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

const bePartSent = () => {
  const router = useRouter();
  const { orgId } = useLocalSearchParams(); // Assuming orgId is passed as a param
  const { userInfo, updateUserInfo } = useContext(AuthContext);

  useEffect(() => {
    console.log("Organization ID: ", orgId);

    if (orgId) {
      // Update userInfo with the new organization_id inside userInfo.user.data.organization_id
      const updatedUserInfo = {
        ...userInfo.user,
        data: {
          ...userInfo.user.data,
          organization_id: orgId, // Set the new orgId here
        },
      };

      updateUserInfo(updatedUserInfo);
      console.log("Updated userInfo with organization ID:", updatedUserInfo);
    }
  }, [orgId]);

  return (
    <View style={styles.container}>
      <Text style={styles.emojiText}>📫 Fuiste aceptado/a! 📫</Text>
      <Text style={styles.messageText}>Ya eres parte de la organizacion</Text>
      <Pressable onPress={() => router.push("/")}>
        <Text style={styles.noteText}>(Ir a marcar mi ingreso diario)</Text>
      </Pressable>
    </View>
  );
};

export default bePartSent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  emojiText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  messageText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
  },
  noteText: {
    fontSize: 14,
    color: "blue",
    textAlign: "center",
    fontStyle: "italic",
  },
});
