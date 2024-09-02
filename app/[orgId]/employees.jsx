import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";
import fetchEmployees from "../../services/organization/fetchEmployees";

const Employees = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);

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

  const renderEmployee = ({ item }) => (
    <View style={styles.employeeContainer}>
      <Text>{item.firstname}</Text>
      <Text>{item.email}</Text>
    </View>
  );

  return (
    <View>
      <Text>employees</Text>
      {organization && (
        <View>
          <Text>{organization._id}</Text>
          <FlatList
            data={employees}
            renderItem={renderEmployee}
            keyExtractor={(item) => item._id.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  employeeContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
});
