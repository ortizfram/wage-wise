import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons"; // Adjust the icon set if needed
import { RESP_URL } from "../../config";
import fetchOrganization from "../../services/organization/fetchOrganization";

export default function Dashboard() {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    loadOrganization();
  }, [orgId]);

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

  const confirmDelete = () => {
    if (Platform.OS === "web") {
      // Web-specific alert using native confirm dialog
      if (
        window.confirm(
          "Seguro quieres eliminar esta organizacion? No puedes deshacer esta accion."
        )
      ) {
        deleteOrg();
      }
    } else {
      // Native mobile alert for iOS/Android
      Alert.alert(
        "Confirmar",
        "Seguro quieres eliminar esta organizacion? No puedes deshacer esta accion.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: deleteOrg,
            style: "destructive", // iOS only: highlights the "Delete" button in red
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {organization ? (
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
      ) : (
        <Text>Loading organization details...</Text>
      )}
      <View style={styles.gridContainer}>
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${organization?._id}/employees`)}
        >
          <Icon name="people" size={30} color="#007bff" />
          <Text style={styles.gridText}>Empleados</Text>
        </Pressable>
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${organization?._id}/downloadReports`)}
        >
          <Icon name="assessment" size={30} color="#007bff" />
          <Text style={styles.gridText}>Descargar reporte mensual de {organization?.name}</Text>
        </Pressable>
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push("/roles")}
        >
          <Icon name="group" size={30} color="#007bff" />
          <Text style={styles.gridText}>Roles</Text>
        </Pressable>
        {/* <Pressable
          style={styles.gridItem}
          onPress={() => router.push("/alerts")}
        >
          <Icon name="notifications" size={30} color="#007bff" />
          <Text style={styles.gridText}>Alertas</Text>
        </Pressable> */}
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push("/correct-record")}
        >
          <Icon name="edit" size={30} color="#007bff" />
          <Text style={styles.gridText}>Corregir un Registro</Text>
        </Pressable>
     
        {/* <Pressable
          style={styles.gridItem}
          onPress={() => router.push("/salary-advance")}
        >
          <Icon name="monetization-on" size={30} color="#007bff" />
          <Text style={styles.gridText}>Adelanto de Sueldo</Text>
        </Pressable> */}
      </View>
      <Pressable style={styles.deleteButton} onPress={confirmDelete}>
        <Icon name="delete" size={24} color="white" />
        <Text style={styles.deleteButtonText}>Eliminar Organización</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  orgName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
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
    padding: 3,
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
