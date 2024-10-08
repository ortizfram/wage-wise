import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import SearchOrganization from "../../components/searchOrganization";
import InOutClock from "../../components/InOutClock";
import QRCodeScanner from "../../utils/QRCodeScanner"; // Import QRCodeScanner
import { RESP_URL } from "../../config";
import axios from "axios";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false); // New state for QR code scanner

  useEffect(() => {
    console.log(userInfo);
    if (!userInfo) {
      router.push("/auth/login");
    }
  }, [userInfo]);

  const handleSelectOrg = async (orgId) => {
    /** go dashboard if i'm part of the organization,also if i'm org Admin. else Join **/
    try {
      const response = await axios.get(
        `${RESP_URL}/api/organization/${orgId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const organization = response.data;
      if (organization.user_id === userInfo?.user?._id) {
        router.push(`/${orgId}/dashboard`);
      } else {
        router.push(`/${orgId}/bePart`);
      }
    } catch (error) {
      console.error("Failed to fetch organization details:", error);
    }
  };

  if (authLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (showScanner) {
    // If scanner is enabled, show the QRCodeScanner component
    return <QRCodeScanner userId={userInfo?.user?._id} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        Bienvenido {userInfo?.user?.isAdmin && <Text>Admin</Text>}{" "}
        {userInfo?.user?.data?.firstname
          ? userInfo?.user?.data?.firstname
          : userInfo?.user?.email || ""}
      </Text>
      {userInfo?.user?.isAdmin ? (
        <>
          <Text style={styles.blue}>Elige tu Establecimiento, o</Text>
          <Pressable style={styles.createBtn}>
            <Text
              style={styles.createText}
              onPress={() => {
                router.push("/organization/create");
              }}
            >
              (+) Crea un nuevo establecimiento
            </Text>
          </Pressable>
          <SearchOrganization
            userId={userInfo._id}
            token={userInfo.token}
            onSelectOrg={handleSelectOrg}
          />
        </>
      ) : userInfo?.user?.data?.organization_id ? (
        <InOutClock orgId={userInfo?.user?.data?.organization_id} />
      ) : (
        <>
          <Text style={styles.blue}>
            Por favor, escanea el QR del establecimiento para formar parte
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => setShowScanner(true)} // Set scanner to true
          >
            <Text style={styles.textButton}>Scanear</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blue: {
    color: "blue",
    marginBottom: 10,
  },
  textButton: { color: "white" },
  button: { padding: 5, backgroundColor: "blue" },
  welcome: {
    marginTop: 15,
    color: "blue",
    fontSize: 20,
  },
  createBtn: {
    padding: 10,
    backgroundColor: "blue",
    marginVertical: 10,
  },
  createText: {
    color: "white",
  },
});
