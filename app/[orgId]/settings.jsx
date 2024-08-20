import React, { useContext } from "react";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RESP_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";
import Spinnerr from "react-native-loading-spinner-overlay";

const Settings = () => {
  const router = useRouter();
  const { userInfo, isLoading, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinnerr visible={isLoading} />
      <Text style={styles.header}>Configuraciones</Text>
      <Text style={styles.account}>{userInfo ? userInfo.email : ""}</Text>

      <Pressable onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Salir de esta cuenta</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  account: {
    color: "blue",
  },
  header: {
    fontSize: 24,
    marginBottom: 24,
  },
  logoutButton: {
    padding: 20,
  },
  logoutText: {
    color: "red",
    fontSize: 18,
  },
  
});

export default Settings;