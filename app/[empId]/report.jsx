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
  const [excedenteCost, setExcedenteCost] = useState(0);
  const [workedTimeMinutes, setWorkedTimeMinutes] = useState(0);
  const [excedenteMin, setExcedenteMin] = useState(0);

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

  const convertExcedenteToMinutes = (excedenteString) => {
    const [hoursPart, minutesPart] = excedenteString.split(" ");
    const hours = parseInt(hoursPart.replace("h", ""), 10) || 0;
    const minutes = parseInt(minutesPart.replace("m", ""), 10) || 0;
    return hours * 60 + minutes;
  };

  const calculateTotalHours = (shifts) => {
    let hours = 0;
    let minutes = 0;
    let holidayMinutes = 0;
  
    // Sum up the total hours and minutes from the shifts
    shifts.forEach((shift) => {
      const [h, m] = shift.total_hours.split(" ");
      hours += parseInt(h.replace("h", ""));
      minutes += parseInt(m.replace("m", ""));
  
      if (shift.shift_mode === "holiday") {
        holidayMinutes +=
          parseInt(h.replace("h", "")) * 60 + parseInt(m.replace("m", ""));
      }
    });
  
    // Adjust hours and minutes
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  
    setTotalHours(hours);
    setTotalMinutes(minutes);
  
    const workedMinutes = hours * 60 + minutes;
    setWorkedTimeMinutes(workedMinutes);
  
    const hourlyFee = employee.hourly_fee || 0;
    const travelCost = employee.travel_cost || 0;
    const bonusPrize = employee.bonus_prize || 0; // Add bonus_prize
  
    const regularCost = (workedMinutes / 60) * hourlyFee;
    const holidayCostValue = (holidayMinutes / 60) * hourlyFee;
    setHolidayCost(Math.floor(holidayCostValue));
  
    // Calculating total cost (including bonus, advance, and bonus_prize)
    const totalCostValue =
      regularCost +
      holidayCostValue +
      travelCost +
      parseFloat(bonus) +
      parseFloat(bonusPrize) - // Include bonus_prize in total
      parseFloat(advance);
  
    setTotalCost(totalCostValue.toFixed(2));
  
    // Handle declared hours and excedente
    const declaredMinutes = employee.declared_hours || 0;
    const excedenteMinutes = workedMinutes - declaredMinutes;
  
    if (excedenteMinutes <= 0) {
      setExcedente("0h 0m");
      setExcedenteCost("0");
      return; // No excedente if worked time is less than declared time
    }
  
    // Convert excedenteMinutes to hours and minutes
    const excedenteHours = Math.floor(excedenteMinutes / 60);
    const excedenteRemainingMinutes = excedenteMinutes % 60;
    setExcedente(`${excedenteHours}h ${excedenteRemainingMinutes}m`);
  
    setExcedenteMin(convertExcedenteToMinutes(excedente));
  
    setExcedenteCost(
      Math.floor(
        excedenteMin * (employee.hourly_fee / 60) + employee.travel_cost
      )
    );
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
              <Text style={styles.employeeText}>{employee.email}</Text>
            )}

            <View>
              <Text style={styles.title}>
                Horas Totales: {totalHours}h {totalMinutes}m
              </Text>
              <Text style={styles.employeeText}>
                Tarifa Horaria: ${employee.hourly_fee || 0} | Costo Viaje: $
                {employee.travel_cost || 0} | Premio: ${employee.bonus_prize || 0} |
                {` Excedente: ${excedente} (${excedenteMin}m)`} | Feriados: $
                {holidayCost || 0}
              </Text>

              <View style={styles.editableRow}>
                <Text style={styles.label}>Restar Adelanto:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(advance)}
                  onChangeText={setAdvance}
                  placeholder="Ingrese adelanto"
                />
              </View>

              {/* <Text style={styles.excedenteText}>
              Excedente: {employee.declaredHours > 0 ? (workedTimeMinutes - employee.declaredHours) : 0}m
            </Text> */}
              <Text style={styles.excedenteText}>
                Excedente: $ {excedenteCost}
              </Text>

              <Text style={styles.largeText}>Total: ${totalCost}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.errorText}>
            No se encontraron datos del empleado
          </Text>
        )}

        {Platform.OS !== "web" && (
          <View style={styles.buttonContainer}>
            {" "}
            {/* Centering container */}
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
                <Text style={{ color: "red" }}> {shift.out}</Text> - Horas:{" "}
                {shift.total_hours}
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
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5, // Reduced vertical space
  },
  datePickerContainer: {
    alignItems: "center",
    marginVertical: 5, // Reduced vertical space
  },
  container: {
    flex: 1,
    padding: 15, // Reduced padding
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15, // Reduced margin
    textAlign: "center",
  },
  employeeText: {
    fontSize: 18,
    marginBottom: 5, // Reduced margin
    textAlign: "center",
  },
  largeText: {
    fontSize: 28, // Slightly smaller size
    marginTop: 5, // Reduced margin
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 5, // Reduced margin
    textAlign: "center",
  },
  editableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5, // Reduced margin
  },
  label: {
    fontSize: 16, // Slightly smaller size
    fontWeight: "bold",
    flex: 1,
    textAlign: "left",
  },
  input: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingHorizontal: 8, // Reduced padding
    fontSize: 16,
    height: 35, // Slightly smaller height
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 8, // Reduced padding
    paddingHorizontal: 15, // Reduced padding
    borderRadius: 5,
    marginTop: 5, // Reduced margin
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  shiftText: {
    fontSize: 14, // Slightly smaller size
    marginVertical: 4, // Reduced margin
    textAlign: "center",
  },
  shiftContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4, // Reduced margin
  },
  circle: {
    width: 25, // Slightly smaller size
    height: 25, // Slightly smaller size
    borderRadius: 12.5, // Adjusted for new size
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Reduced margin
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14, // Slightly smaller size
  },
  star: {
    width: 25, // Slightly smaller size
    height: 25, // Slightly smaller size
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8, // Reduced margin
    backgroundColor: "yellow",
    borderRadius: 12.5, // Adjusted for new size
    overflow: "hidden",
    position: "relative",
  },
  starText: {
    color: "black",
    fontSize: 16, // Slightly smaller size
    fontWeight: "900",
    position: "absolute",
    top: "15%",
    left: "35%",
  },
  excedenteText: {
    fontSize: 16, // Smaller font size for excedente
    color: "gray", // Optional color to differentiate
    textAlign: "center",
    marginTop: 10, // Add space above
  },
});
