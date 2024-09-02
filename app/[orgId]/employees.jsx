import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import fetchOrganization from "../../services/organization/fetchOrganization";

const Employees = () => {
  const { orgId } = useLocalSearchParams();
  const router = useRouter();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const data = await fetchOrganization(orgId);
        setOrganization(data);
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    };

    loadOrganization();
  }, [orgId]);

  return (
    <View>
      <Text>employees</Text>
      {organization && <Text>{organization._id}</Text>}
    </View>
  );
};

export default Employees;

const styles = StyleSheet.create({});
