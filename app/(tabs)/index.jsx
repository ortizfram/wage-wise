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
import QRCodeScanner from "../../utils/QRCodeScanner";
import { RESP_URL } from "../../config";
import axios from "axios";
import { useCameraPermissions } from "expo-camera";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
    }
    console.log("permission orgList", permission);
  }, [userInfo, permission]);

  if (!permission || !permission.granted) {
    return (
      <View
        style={{
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 200,
        }}
      >
        <Text style={styles.welcome}>
          Bienvenido {userInfo?.user?.isAdmin && <Text>Admin</Text>}{" "}
          {userInfo?.user?.data?.firstname
            ? userInfo?.user?.data?.firstname
            : userInfo?.user?.email || ""}
        </Text>
        <Text>Acceso a camara es requerido para escanear Codigo QR.</Text>
        <Pressable onPress={requestPermission}>
          <Text style={{ color: "blue", textAlign: "center" }}>Permitir</Text>
        </Pressable>
      </View>
    );
  }

  const isPermissionGranted = permission.granted;

  const handleSelectOrg = async (orgId) => {
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
            disabled={!isPermissionGranted}
            onPress={() =>
              router.push(`/scanner?userId=${userInfo?.user?._id}`)
            }
          >
            <Text
              style={[
                styles.textButton,
                { opacity: isPermissionGranted ? 1 : 0.5 },
              ]}
            >
              Scanear Código
            </Text>
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
    color: "gray",
    marginBottom: 10,
  },
  textButton: { color: "blue", paddingTop: 10, gap: 20 },
  button: {
    padding: 10,
    backgroundColor: "lightgray",
    marginVertical: 10,
    borderRadius: 5,
  },
  welcome: {
    marginTop: 15,
    color: "gray",
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
