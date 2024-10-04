import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Button,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchEmployeeWithId } from "../../services/organization/fetchEmployees";
import { updateEmployee } from "../../services/employee/employee";

const Index = () => {
  const { empId } = useLocalSearchParams();
  const [employee, setEmployee] = useState({
    firstname: "",
    lastname: "",
    email: "",
    hourly_fee: 0,
    declared_hours: 0,
    travel_cost: 0,
    bonus_prize: 0,
    cash_advance: 0,
    cash_a_date: "",
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await fetchEmployeeWithId(empId);
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };
    loadEmployee();
  }, [empId]);

  const handleInputChange = (field, value) => {
    setEmployee((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    const updatedData = await updateEmployee(empId, employee);
    setEmployee(updatedData);
    console.log("Updated Employee Data:", employee);
    setTimeout(() => {
      setLoading(false);
      alert("Changes saved successfully!");
    }, 2000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          Empleado:{" "}
          {employee?.firstname
            ? `${employee.firstname} ${employee.lastname}`
            : employee.email}
        </Text>

        {/* Reporte de Horas Button */}
        <Pressable
          style={styles.gridItem}
          onPress={() => router.push(`${empId}/report`)}
        >
          <Text style={styles.gridText}>🕒 Reporte de Horas</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Editar valores</Text>

        {/* Editable Fields with Titles */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={employee.firstname}
            onChangeText={(text) => handleInputChange("firstname", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={employee.lastname}
            onChangeText={(text) => handleInputChange("lastname", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Email</Text>
          <TextInput
            style={styles.input}
            value={employee.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Precio Hora</Text>
          <TextInput
            style={styles.input}
            value={String(employee.hourly_fee)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("hourly_fee", Number(text))
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Horas Declaradas</Text>
          <Text style={styles.fieldDescription}>
            Ingresar unicamente si tiene bono de sueldo, para poder sacar las
            horas excedentes. Se ingresa en minutos. Ejemplo : 1.5hs se ingresa
            como 90.
          </Text>
          <TextInput
            style={styles.input}
            value={String(employee.declared_hours)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("declared_hours", Number(text))
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Viáticos</Text>
          <TextInput
            style={styles.input}
            value={String(employee.travel_cost)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("travel_cost", Number(text))
            }
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldTitle}>Premio</Text>
          <TextInput
            style={styles.input}
            value={String(employee.bonus_prize)}
            keyboardType="numeric"
            onChangeText={(text) =>
              handleInputChange("bonus_prize", Number(text))
            }
          />
        </View>

        {/* Save Button */}
        <Button
          title={loading ? "Guardando..." : "Guardar"}
          onPress={handleSaveChanges}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10, // Reduced padding
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    padding: 10, // Reduced padding
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20, // Reduced font size
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  fieldGroup: {
    marginBottom: 10, // Reduced margin between fields
  },
  fieldTitle: {
    fontSize: 14, // Reduced font size
    fontWeight: "bold",
    marginBottom: 5,
  },
  fieldDescription: {
    fontSize: 10, // Reduced font size
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 40, // Reduced height
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14, // Reduced font size
  },
  gridItem: {
    marginTop: 10,
    width: "80%", // Reduced width to take less space
    height: 50, // Reduced height
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8, // Reduced border radius
    alignSelf: "center",
  },
  gridText: {
    fontSize: 16, // Reduced font size
    fontWeight: "bold",
    color: "#fff",
  },
});
