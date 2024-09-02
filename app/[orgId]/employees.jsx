import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

  const handlePress = (employeeId) => {
    router.push(`/employee/${employeeId}`);
  };

  const renderEmployee = ({ item }) => (
    <TouchableOpacity 
      style={styles.employeeContainer} 
      onPress={() => handlePress(item._id)}
    >
      <Text>{item.firstname} {item.lastname}</Text>
      <Text>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>Employees</Text>
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
