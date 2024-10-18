import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import { fetchEmployees } from "../../services/organization/fetchEmployees";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DownloadReports = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [shifts, setShifts] = useState([]);

  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(orgId);
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadOrganization();
    loadEmployees();
  }, [orgId]);

  const onStartDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      setStartDate(event);
    } else {
      const currentDate = selectedDate || startDate;
      setShowStartDatePicker(Platform.OS === "ios");
      setStartDate(currentDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      setEndDate(event);
    } else {
      const currentDate = selectedDate || endDate;
      setShowEndDatePicker(Platform.OS === "ios");
      setEndDate(currentDate);
    }
  };

  const handlePress = (empId) => {
    router.push(`${empId}`);
  };

  const renderEmployee = ({ item }) => {
    console.log("Employee item:", item); // Log the item to see its structure

    const displayName =
      item.firstname && item.lastname
        ? `${item.firstname} ${item.lastname}`
        : item.email; // Fallback to email if names are not available

    return (
      <TouchableOpacity
        style={styles.employeeContainer}
        onPress={() => handlePress(item._id)}
      >
        <Text>{displayName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Descargar reporte mensual de {organization?.name}
      </Text>
      <Text>
        Selecciona las fechas para filtrar los reportes haciendo doble click
        para mostrar el calendario
      </Text>
      {organization && (
        <View style={{ marginTop: 10 }}>
          {Platform.OS !== "web" && (
            <View style={styles.buttonContainer}>
              {" "}
              {/* Centering container */}
              <Pressable
                style={styles.button}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.buttonText}>
                  Seleccionar Fecha de Inicio
                </Text>
              </Pressable>
              <Pressable
                style={styles.button}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.buttonText}>Seleccionar Fecha de Fin</Text>
              </Pressable>
            </View>
          )}

          {showStartDatePicker && Platform.OS !== "web" && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}

          {showEndDatePicker && Platform.OS !== "web" && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}

          {Platform.OS === "web" && (
            <View style={styles.datePickerContainer}>
              {" "}
              {/* Centering for web */}
              <Text style={styles.label}>Seleccionar Fecha de Inicio</Text>
              <DatePicker selected={startDate} onChange={onStartDateChange} />
              <Text style={styles.label}>Seleccionar Fecha de Fin</Text>
              <DatePicker selected={endDate} onChange={onEndDateChange} />
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default DownloadReports;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Set to flex: 1 to enable scrolling
    padding: 20,
  },
  employeeContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  list: {
    maxHeight: 400, // Set a max height for the FlatList if needed
  },
});
