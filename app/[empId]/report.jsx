import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  TextInput,
  ScrollView,
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
  const [totalPayment, setTotalPayment] = useState(0);
  const [holidayCost, setHolidayCost] = useState(0);
  const [excedente, setExcedente] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  const [bonus, setBonus] = useState(0);
  const [advance, setAdvance] = useState(0);

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
        calculateTotalHours(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    loadEmployee();
    loadShiftForEmployee();
  }, [empId, startDate, endDate, bonus, advance]);

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
    let holidayMinutes = 0;

    shifts.forEach((shift) => {
      const [h, m] = shift.total_hours.split(" ");
      hours += parseInt(h.replace("h", ""));
      minutes += parseInt(m.replace("m", ""));

      if (shift.shift_mode === "holiday") {
        holidayMinutes +=
          parseInt(h.replace("h", "")) * 60 + parseInt(m.replace("m", ""));
      }
    });

    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;

    setTotalHours(hours);
    setTotalMinutes(minutes);

    const totalWorkedMinutes = hours * 60 + minutes;
    const hourlyFee = employee.hourly_fee || 0;
    const travelCost = employee.travel_cost || 0;

    const regularCost = (totalWorkedMinutes / 60) * hourlyFee;
    const holidayCostValue = (holidayMinutes / 60) * hourlyFee;
    setHolidayCost(holidayCostValue);

    const totalCostValue =
      regularCost +
      holidayCostValue +
      travelCost +
      parseFloat(bonus) -
      parseFloat(advance);
    setTotalCost(totalCostValue.toFixed(2));

    const declaredHours = employee.declared_hours || 0;
    const excedente = declaredHours ? hours - declaredHours : 0;
    setExcedente(excedente);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Reporte de Horas</Text>

        {employee && employee.email ? (
          <View>
            {employee.firstname && employee.lastname ? (
              <Text style={styles.employeeText}>
                {employee.firstname} {employee.lastname}
              </Text>
            ) : (
              <View></View>
            )}

            <Text style={styles.employeeText}>{employee.email}</Text>
            <View>
              <Text style={styles.title}>
                Horas Totales: {totalHours}h {totalMinutes}m
              </Text>
              <Text style={styles.employeeText}>
                Tarifa Horaria: ${employee.hourly_fee || 0} | Costo Viaje: $
                {employee.travel_cost || 0} |{` Excedente: ${excedente}hs`} |
                Feriados: ${holidayCost || 0}
              </Text>

              <View style={styles.editableRow}>
                <Text style={styles.label}>Premio:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(bonus)}
                  onChangeText={setBonus}
                  placeholder="Ingrese premio"
                />
              </View>

              <View style={styles.editableRow}>
                <Text style={styles.label}>Adelanto:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(advance)}
                  onChangeText={setAdvance}
                  placeholder="Ingrese adelanto"
                />
              </View>

              <Text style={styles.largeText}>Total: ${totalCost}</Text>
            </View>
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
            <View key={index} style={styles.shiftContainer}>
              {shift.shift_mode === "holiday" ? (
                <View style={styles.star}>
                  <Text style={styles.starText}>F</Text>
                </View>
              ) : (
                <View style={styles.circle}>
                  <Text style={styles.circleText}>R</Text>
                </View>
              )}
              <Text style={styles.shiftText}>
                {shift.date} -{" "}
                <Text style={{ color: "green" }}> {shift.in}</Text> -{" "}
                <Text style={{ color: "red" }}> {shift.out}</Text> -{" "}
                Horas: {shift.total_hours}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.errorText}>
            No se encontraron turnos para las fechas seleccionadas
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Report;
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
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
  employeeText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  largeText: {
    fontSize: 30,
    marginTop: 10,
    fontWeight:700,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  editableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
    height: 40,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  shiftText: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: "center",
  },
  shiftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  star: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    backgroundColor: "yellow", // Make the background yellow
    borderRadius: 15, // This creates a circular background
    overflow: "hidden",
    position: "relative",
  },
  starText: {
    color: "black", // Set text color to black for contrast
    fontSize: 18,
    fontWeight: "900",
    position: "absolute",
    top: "15%", // Adjust position for better alignment
    left: "35%",
  },
});
