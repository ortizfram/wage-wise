import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import { fetchEmployees } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
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
    const currentDate = selectedDate || startDate;
    setStartDate(currentDate);
    if (Platform.OS !== "web") {
      setShowStartDatePicker(Platform.OS === "ios");
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setEndDate(currentDate);
    if (Platform.OS !== "web") {
      setShowEndDatePicker(Platform.OS === "ios");
    }
  };

  const handleDownloadClick = async () => {
    for (let employee of employees) {
      let csvContent =
        "Fecha,Empleado,Horas Totales,Tarifa Horaria,Costo Viaje,Premio,Excedente,Feriados,Total Excedente,Total Final\n"; // Updated CSV headers

      try {
        const shiftsData = await fetchShiftWithId(
          employee._id,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );

        // Process shift data for each employee
        const workedTimeMinutes = shiftsData.reduce((total, shift) => {
          const [h, m] = shift.total_hours.split(" ");
          const hours = parseInt(h.replace("h", ""), 10) || 0;
          const minutes = parseInt(m.replace("m", ""), 10) || 0;
          return total + hours * 60 + minutes; // Convert total hours to minutes
        }, 0);

        // Convert worked time to hours and minutes for display
        const workedHours = Math.floor(workedTimeMinutes / 60);
        const remainingMinutes = workedTimeMinutes % 60;

        const hourlyFee = employee.hourly_fee || 0;
        const travelCost = employee.travel_cost || 0;
        const bonusPrize = employee.bonus_prize || 0;
        const holidayCost = shiftsData.reduce((total, shift) => {
          return (
            total +
            (shift.shift_mode === "holiday"
              ? parseInt(shift.total_hours.split(" ")[0]) * hourlyFee
              : 0)
          );
        }, 0);

        const declaredMinutes = employee.declared_hours || 0;
        const excedenteMinutes = Math.max(
          0,
          workedTimeMinutes - declaredMinutes
        );
        const excedenteCost = Math.floor(
          excedenteMinutes * (hourlyFee / 60) + travelCost
        ); // Cost of exceeded minutes

        const totalFinal =
          (workedTimeMinutes / 60) * hourlyFee +
          holidayCost +
          travelCost +
          parseFloat(bonusPrize); // Calculate total final payment

        // Prepare CSV row with total hours formatted
        csvContent += `${new Date().toLocaleDateString("en-GB")},${
          employee.firstname
        } ${
          employee.lastname
        },${workedHours}h ${remainingMinutes}m,${hourlyFee},${travelCost},${bonusPrize},${excedenteMinutes}m,${holidayCost},${excedenteCost},${totalFinal.toFixed(
          2
        )}\n`;
      } catch (error) {
        console.error(
          `Error fetching shifts for employee ${employee._id}:`,
          error
        );
      }

      // Function to download the CSV
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${employee.firstname}_${employee.lastname}_${
          startDate.toISOString().split("T")[0]
        }_${endDate.toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
              <Text style={styles.label}>Seleccionar Fecha de Inicio</Text>
              <DatePicker selected={startDate} onChange={onStartDateChange} />
              <Text style={styles.label}>Seleccionar Fecha de Fin</Text>
              <DatePicker selected={endDate} onChange={onEndDateChange} />
            </View>
          )}

          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleDownloadClick}
          >
            <Text style={styles.downloadButtonText}>Descargar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DownloadReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  downloadButton: {
    marginTop: 20,
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  datePickerContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
  },
});
