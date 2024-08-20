import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RESP_URL } from "../../config";
import axios from "axios";
import Icon from 'react-native-vector-icons/MaterialIcons'; // Adjust the icon set if needed

export default function Dashboard() {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();

  const deleteOrg = async () => {
    try {
      const response = await axios.delete(
        `${RESP_URL}/api/organization/${orgId}`
      );
      if (response.status === 200) {
        console.log("Organization deleted");
        router.push("/");
      }
    } catch (error) {
      console.error("Error deleting organization:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard for Organization {orgId}</Text>
      <View style={styles.gridContainer}>
        <Pressable style={styles.gridItem} onPress={() => router.push("/employees")}>
          <Icon name="people" size={30} color="#007bff" />
          <Text style={styles.gridText}>Empleados</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push("/roles")}>
          <Icon name="group" size={30} color="#007bff" />
          <Text style={styles.gridText}>Roles</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push("/alerts")}>
          <Icon name="notifications" size={30} color="#007bff" />
          <Text style={styles.gridText}>Alertas</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push("/correct-record")}>
          <Icon name="edit" size={30} color="#007bff" />
          <Text style={styles.gridText}>Corregir un Registro</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push("/reports")}>
          <Icon name="assessment" size={30} color="#007bff" />
          <Text style={styles.gridText}>Reportes</Text>
        </Pressable>
        <Pressable style={styles.gridItem} onPress={() => router.push("/salary-advance")}>
          <Icon name="monetization-on" size={30} color="#007bff" />
          <Text style={styles.gridText}>Adelanto de Sueldo</Text>
        </Pressable>
      </View>
      <Pressable style={styles.deleteButton} onPress={deleteOrg}>
        <Icon name="delete" size={24} color="white" />
        <Text style={styles.deleteButtonText}>Eliminar esta Organización y sus datos</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  gridItem: {
    width: "45%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // For Android shadow
  },
  gridText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 20, // Ensures it's at the bottom
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});
