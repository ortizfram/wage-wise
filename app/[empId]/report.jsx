import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { useLocalSearchParams } from "expo-router";

const report = () => {
  const { uid } = useLocalSearchParams();
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeWithId(uid);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    loadEmployee();
  }, [uid]);
  return (
    <View>
      <Text>report</Text>
      <Text>{employee.email}</Text>
    </View>
  );
};

export default report;

const styles = StyleSheet.create({});
