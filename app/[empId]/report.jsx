import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
import { useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Report = () => {
  const { empId } = useLocalSearchParams();
  const [employee, setEmployee] = useState({});
  const [shifts, setShifts] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeWithId(empId);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    const loadShiftForEmployee = async () => {
      try {
        const data = await fetchShiftWithId(
          empId,
          startDate.toISOString().split("T")[0],
          endDate.toISOString().split("T")[0]
        );
        setShifts(data);
        calculateTotalHours(data); // Calcular horas totales
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    loadEmployee();
    loadShiftForEmployee();
  }, [empId, startDate, endDate]);

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

  const calculateTotalHours = (shifts) => {
    let hours = 0;
    let minutes = 0;

    shifts.forEach((shift) => {
      // Suponiendo que shift.total_hours es algo como "2h 45m"
      const [h, m] = shift.total_hours.split(" ");
      hours += parseInt(h.replace("h", ""));
      minutes += parseInt(m.replace("m", ""));
    });

    // Si los minutos suman más de 60, convertir en horas
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    setTotalHours(hours);
    setTotalMinutes(minutes);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte de Horas</Text>

      {employee && employee.email ? (
        <View>
          <Text style={styles.employeeText}>{employee.email}</Text>
          <Text style={styles.title}>
            Horas Totales: {totalHours}h {totalMinutes}m
          </Text>
        </View>
      ) : (
        <Text style={styles.errorText}>
          No se encontraron datos del empleado
        </Text>
      )}

      {Platform.OS !== "web" && (
        <>
          <Pressable
            style={styles.button}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.buttonText}>Seleccionar Fecha de Inicio</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.buttonText}>Seleccionar Fecha de Fin</Text>
          </Pressable>
        </>
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
        <View>
          <Text style={styles.label}>Seleccionar Fecha de Inicio</Text>
          <DatePicker selected={startDate} onChange={onStartDateChange} />
          <Text style={styles.label}>Seleccionar Fecha de Fin</Text>
          <DatePicker selected={endDate} onChange={onEndDateChange} />
        </View>
      )}

      {shifts.length > 0 ? (
        shifts.map((shift, index) => (
          <Text key={index} style={styles.shiftText}>
            Día: {shift.date} - Entrada: {shift.in} - Salida: {shift.out} -
            Horas: {shift.total_hours}
          </Text>
        ))
      ) : (
        <Text style={styles.errorText}>
          No se encontraron turnos para las fechas seleccionadas
        </Text>
      )}
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  employeeText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  shiftText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
});
