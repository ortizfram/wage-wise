import React, { useContext, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import SearchOrganization from "../../components/searchOrganization";
import InOutClock from "../../components/InOutClock";
import { RESP_URL } from "../../config";
import axios from "axios";

export default function OrganizationList() {
  const { userInfo, isLoading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!userInfo) {
      router.push("/auth/login");
    }
    console.log("userInfo.user = ", JSON.stringify(userInfo.user));
  }, [userInfo]);

  const handleSelectOrg = async (orgId) => {
      /** go dashboard if i'm part of the organization,also if i'm org Admin. else Join **/
      try {
        const response = await axios.get(`${RESP_URL}/api/organization/${orgId}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
  
        const organization = response.data;
        if (organization.user_id === userInfo._id) {
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
      <Text style={styles.welcome}>Bienvenido {userInfo?.email || ""}</Text>
      {userInfo?.isAdmin ? (
        <>
          <Text style={styles.blue}>Elige tu Establecimiento, o</Text>
          <Pressable style={styles.createBtn}>
            <Text
              style={styles.createText}
              onPress={() => {
                router.push("/organization/create");
              }}
            >
              (+) Crea otra organización
            </Text>
          </Pressable>
          <SearchOrganization
            userId={userInfo._id}
            token={userInfo.token}
            onSelectOrg={handleSelectOrg}
          />
        </>
      ) : userInfo?.user?.organization_id ? (
        <InOutClock orgId={userInfo?.user?.organization_id}/>
      ) : (
        <>
          <Text style={styles.blue}>
            Envia la solicitud para ser parte de una organización
          </Text>
          <SearchOrganization
            userId={userInfo._id}
            token={userInfo.token}
            onSelectOrg={handleSelectOrg}
          />
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
