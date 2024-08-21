import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { RESP_URL } from "../../config";

const BePart = () => {
  const { orgId } = useLocalSearchParams();
  const [organization, setOrganization] = useState(null);

  const sendReq = ()=>{
    console.log("enviando...")

  }

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(
          `${RESP_URL}/api/organization/${orgId}`
        );
        setOrganization(response.data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchOrganization();
  }, [orgId]);

  return (
    <View style={styles.container}>
      {organization ? (
        <View style={styles.content}>
          <Text style={styles.title}>Se parte de :</Text>
          <View style={styles.header}>
            <Image
              source={
                organization.image
                  ? { uri: `${RESP_URL}/${organization.image}` }
                  : require("../../assets/images/org_placeholder.jpg")
              }
              style={styles.image}
            />
            <Text style={styles.orgName}>{organization.name}</Text>
          </View>
          <Pressable style={styles.button} onPress={sendReq}>
            <Text style={styles.buttonText}>Enviar solicitud</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.loading}>Cargando ...</Text>
      )}
    </View>
  );
};

export default BePart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  orgName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
});