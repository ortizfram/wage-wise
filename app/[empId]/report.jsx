import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import { fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { fetchShiftWithId } from "../../services/userShift/fetchShifts";
import { useLocalSearchParams } from "expo-router";

// DateTimePicker for mobile (iOS and Android)
import DateTimePicker from "@react-native-community/datetimepicker";

// DatePicker for web
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Report = () => {
  const { empId } = useLocalSearchParams(); // Get employee ID
  const [employee, setEmployee] = useState({});
  const [shifts, setShifts] = useState([]);
  const [startDate, setStartDate] = useState(new Date()); // Initial start date
  const [endDate, setEndDate] = useState(new Date()); // Initial end date
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Function to load employee and shifts
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
          startDate.toISOString().split("T")[0], // Format to YYYY-MM-DD
          endDate.toISOString().split("T")[0]
        );
        setShifts(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      }
    };

    loadEmployee();
    loadShiftForEmployee();
  }, [empId, startDate, endDate]); // Dependencies on start and end date

  // Handle date change for Start Date
  const onStartDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      setStartDate(event); // For web, event is the selected date
    } else {
      const currentDate = selectedDate || startDate;
      setShowStartDatePicker(Platform.OS === "ios");
      setStartDate(currentDate);
    }
  };

  // Handle date change for End Date
  const onEndDateChange = (event, selectedDate) => {
    if (Platform.OS === "web") {
      setEndDate(event); // For web, event is the selected date
    } else {
      const currentDate = selectedDate || endDate;
      setShowEndDatePicker(Platform.OS === "ios");
      setEndDate(currentDate);
    }
  };

  return (
    <View>
      <Text>Report</Text>

      {employee && employee.email ? (
        <Text>{employee.email}</Text>
      ) : (
        <Text>No employee data found</Text>
      )}

      {/* Buttons to show date picker for mobile platforms */}
      {Platform.OS !== "web" && (
        <>
          <Button
            title="Select Start Date"
            onPress={() => setShowStartDatePicker(true)}
          />
          <Button
            title="Select End Date"
            onPress={() => setShowEndDatePicker(true)}
          />
        </>
      )}

      {/* Date Picker for mobile (iOS and Android) */}
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

      {/* Date Picker for web */}
      {Platform.OS === "web" && (
        <View>
          <Text>Select Start Date</Text>
          <DatePicker
            selected={startDate}
            onChange={(date) => onStartDateChange(date)}
          />
          <Text>Select End Date</Text>
          <DatePicker
            selected={endDate}
            onChange={(date) => onEndDateChange(date)}
          />
        </View>
      )}

      {/* Display the selected date range */}
      <Text>Selected Start Date: {startDate.toDateString()}</Text>
      <Text>Selected End Date: {endDate.toDateString()}</Text>

      {/* Display shifts */}
      {shifts.length > 0 ? (
        shifts.map((shift, index) => (
          <Text key={index}>{shift.shiftName}</Text> // Adjust based on your shift schema
        ))
      ) : (
        <Text>No shifts found for the selected date range</Text>
      )}
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({});
