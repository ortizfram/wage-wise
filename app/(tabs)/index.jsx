import React, { useContext, useEffect } from "react";
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
import { RESP_URL } from "../../config";
import axios from "axios";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();
  const [showSearch, setShowSearch] = React.useState(false); // Nuevo estado para controlar el renderizado de SearchOrganization

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
      ) : userInfo?.user?.data?.organization_id && !showSearch ? (
        <InOutClock orgId={userInfo?.user?.data?.organization_id} />
      ) : (
        <>
          {!showSearch && (
            <>
              <Text style={styles.blue}>
                Busca el nombre de la organizacion o nombre del dueño, para enviar la solicitud y ser parte de la organización
              </Text>
              <SearchOrganization
                userId={userInfo._id}
                token={userInfo.token}
                onSelectOrg={handleSelectOrg}
              />
            </>
          )}
        </>
      )}

      {/* Pressable rojo para cambiar de establecimiento */}
      <Pressable
        style={styles.redButton}
        onPress={() => setShowSearch(true)} // Al hacer clic, renderiza SearchOrganization
      >
        <Text style={styles.redButtonText}>Hoy estoy en otro establecimiento</Text>
      </Pressable>

      {/* Renderiza SearchOrganization si el botón rojo ha sido presionado */}
      {showSearch && (
        <SearchOrganization
          userId={userInfo._id}
          token={userInfo.token}
          onSelectOrg={handleSelectOrg}
        />
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
  redButton: {
    // backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    // marginTop: 3,
  },
  redButtonText: {
    color: "red",
    // fontWeight: "bold",
    textAlign: "center",
  },
});
