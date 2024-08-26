import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { RESP_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";

const BePart = () => {
  const { orgId } = useLocalSearchParams();
  const [organization, setOrganization] = useState(null);
  const router = useRouter();
  const userInfo = useContext(AuthContext);

  const sendReq = async () => {
    console.log("enviando...");
    try {
      const res = await axios.post(`${RESP_URL}/api/organization/${orgId}/bePart`, {
        uid: userInfo._id
      });

      if (res.status === 200 || res.status === 201) {
        console.log("Request sent:", res.data);

        // Send email to the organization owner
        const emailRes = await axios.post(`${RESP_URL}/api/sendEmail`, {
          ownerId: organization.ownerId, // Assuming you have ownerId in the organization object
          uid: userInfo._id,
          subject: "Request to Join Organization",
          text: `User ${userInfo.name} wants to join your organization.`,
          html: `<p>User <strong>${userInfo.name}</strong> wants to join your organization.</p>`
        });

        if (emailRes.status === 200 || emailRes.status === 201) {
          console.log("Email sent:", emailRes.data);
          router.push(`/${orgId}/bePartSent`);
        } else {
          console.error("Failed to send email:", emailRes);
        }
      }
    } catch (error) {
      console.error("Error during sendReq:", error);
    }
  };

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await axios.get(`${RESP_URL}/api/organization/${orgId}`);
        setOrganization(response.data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };

    fetchOrganization();
  }, [orgId]);

  return (
    <View style={styles.container}>
      {organization ? (
        <View style={styles.content}>
          <Text style={styles.title}>Se parte de :</Text>
          <View style={styles.header}>
            <Image
              source={
                organization.image
                  ? { uri: `${RESP_URL}/${organization.image}` }
                  : require("../../assets/images/org_placeholder.jpg")
              }
              style={styles.image}
            />
            <Text style={styles.orgName}>{organization.name}</Text>
          </View>
          <Pressable style={styles.button} onPress={sendReq}>
            <Text style={styles.buttonText}>Enviar solicitud</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.loading}>Cargando ...</Text>
      )}
    </View>
  );
};

export default BePart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  orgName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loading: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
  },
});
