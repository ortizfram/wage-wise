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
  const [showSearch, setShowSearch] = React.useState(false); // State to control the render of SearchOrganization

  useEffect(() => {
    console.log(userInfo);
    if (!userInfo) {
      router.push("/auth/login");
    }
  }, [userInfo]);

  const handleSelectOrg = async (orgId) => {
    // Navigate to dashboard or join organization based on user relation
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

      {/* Admins do not see the search organization component */}
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
      ) : (
        <>
          {userInfo?.user?.data?.organization_id ? (
            <InOutClock orgId={userInfo?.user?.data?.organization_id} />
          ) : (
            <>
              <Text style={styles.blue}>
                Busca el nombre de la organización o nombre del dueño, para
                enviar la solicitud y ser parte de la organización
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

      {/* Button to switch establishments */}
      {!userInfo?.user?.isAdmin && (
        <Pressable
          style={styles.redButton}
          onPress={() => setShowSearch(true)} // Show search organization
        >
          <Text style={styles.redButtonText}>
            Hoy estoy en otro establecimiento
          </Text>
        </Pressable>
      )}

      {/* Render SearchOrganization if the button has been pressed and user is not admin */}
      {showSearch && !userInfo?.user?.isAdmin && (
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
    padding: 10,
    borderRadius: 5,
  },
  redButtonText: {
    color: "red",
    textAlign: "center",
  },
});
