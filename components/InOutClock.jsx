import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { RESP_URL } from "../config";
import { AuthContext } from "../context/AuthContext";

const InOutClock = ({ orgId }) => {
  const { userInfo } = useContext(AuthContext);
  const [org, setOrg] = useState("");

  const fetchOrg = async () => {
    try {
      const response = await axios.get(
        `${RESP_URL}/api/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const foundOrg = response.data;
      setOrg(foundOrg);
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{org.name}</Text>
      <Pressable
        style={styles.actionBtn}
        onPress={() => console.log("Handle Ingreso action")}
      >
        <Text style={styles.actionText}>Ingreso</Text>
      </Pressable>
      <Pressable
        style={styles.actionBtn}
        onPress={() => console.log("Handle Egreso action")}
      >
        <Text style={styles.actionText}>Egreso</Text>
      </Pressable>
    </View>
  );
};

export default InOutClock;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  actionBtn: {
    width: "100%",
    marginVertical: 15,
    paddingVertical: 15,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});
