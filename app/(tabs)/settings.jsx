import React, { useContext } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
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

      <Pressable
        onPress={() => router.push(`${userInfo?.user?._id}/profile`)}
        style={styles.logoutButton}
      >
        <Text style={styles.linkText}>Mi Perfil</Text>
      </Pressable>
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
  linkText: {
    color: "blue",
    fontSize: 15,
  },
});

export default Settings;
