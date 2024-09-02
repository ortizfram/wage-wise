import React, { useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import axios from "axios";
import { RESP_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { Alert } from "react-native-web";
import { format } from "date-fns-tz";

const InOutClock = ({ orgId }) => {
  const { userInfo } = useContext(AuthContext);
  const [org, setOrg] = useState(null);
  const [isEgresoVisible, setIsEgresoVisible] = useState(false);
  const [isIngresoVisible, setIsIngresoVisible] = useState(true);
  const [inTime, setInTime] = useState(null); // Track the in-time
  const [outTime, setOutTime] = useState(null); // Track the out-time

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

  const timeZone = "America/Argentina/Buenos_Aires";

  const handleIngresoPress = async () => {
    const now = new Date();
    const currentInTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }); // Convert current time to ART
    setInTime(currentInTime);

    try {
      const response = await axios.post(
        `${RESP_URL}/api/shift/${userInfo._id}/${org._id}`,
        {
          inTime: currentInTime, // Send the in-time as ISO string
          shiftMode: "regular",
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setIsEgresoVisible(true);
        setIsIngresoVisible(false);
      } else {
        console.log("Failed to create shift");
        Alert.alert("Error", "Failed to clock in. Please try again.");
      }
    } catch (error) {
      console.log("Error during handleIngresoPress:", error);
      Alert.alert(
        "Error",
        "An error occurred during clock in. Please try again."
      );
    }
  };

  const handleEgresoPress = async () => {
    const now = new Date();
    const currentOutTime = format(now, "yyyy-MM-dd'T'HH:mm:ssXXX", {
        timeZone,
    }); // Convert current time to ART
    setOutTime(currentOutTime);

    try {
        const response = await axios.put(
            `${RESP_URL}/api/shift/${userInfo._id}/${org._id}`,
            {
                outTime: currentOutTime, // Send the out-time as ISO string
            },
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.status === 200) {
            setIsEgresoVisible(false);
            setIsIngresoVisible(true);
            setInTime(null); // Reset in-time
            setOutTime(null); // Reset out-time
        } else {
            console.log("Failed to complete shift");
            Alert.alert("Error", "Failed to clock out. Please try again.");
        }
    } catch (error) {
        console.log("Error during handleEgresoPress:", error);
        Alert.alert(
            "Error",
            "An error occurred during clock out. Please try again."
        );
    }
};


  return (
    <View style={styles.container}>
      {org ? (
        <>
          <Image
            source={
              org.image
                ? { uri: `${RESP_URL}/${org.image}` }
                : require("../assets/images/org_placeholder.jpg")
            }
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>{org.name}</Text>
        </>
      ) : (
        <Text>Loading organization details...</Text>
      )}
      {isIngresoVisible && (
        <Pressable style={styles.actionBtn} onPress={handleIngresoPress}>
          <Text style={styles.actionText}>Ingreso</Text>
        </Pressable>
      )}
      {isEgresoVisible && (
        <Pressable style={styles.actionBtnL} onPress={handleEgresoPress}>
          <Text style={styles.actionText}>Egreso</Text>
        </Pressable>
      )}
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
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
  actionBtnL: {
    width: "100%",
    marginVertical: 15,
    paddingVertical: 15,
    backgroundColor: "red",
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
