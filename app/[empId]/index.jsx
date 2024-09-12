import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const Index = () => {
  const { empId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        <Text style={styles.title}>Nombre Apellido</Text>
        <Text style={styles.subtitle}>ID: {empId}</Text>

        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${empId}/upload`)}
        >
          <Text style={styles.gridText}>Subir Documentos</Text>
        </Pressable>

        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${empId}/files`)}
        >
          <Text style={styles.gridText}>Buscar Documentos</Text>
        </Pressable>

        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${empId}/report`)}
        >
          <Text style={styles.gridText}>Reporte de Horas</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;

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
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  gridContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "90%", // Large button
    height: 120, // Height for bigger buttons
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  gridText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
