import {
 StyleSheet,
 Text,
 View,
 Image,
 TextInput,
 Pressable,
 Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext"; // Make sure AuthContext is imported
import { RESP_URL } from "../../config";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

const Profile = () => {
 // Extract both userInfo and updateUserInfo from AuthContext
 const { userInfo, updateUserInfo } = useContext(AuthContext); 
 const [editable, setEditable] = useState(false); // Toggle between edit and view mode
 const [updatedData, setUpdatedData] = useState({
   email: userInfo?.user?.email || "",
   firstname: userInfo?.user?.firstname || "",
   lastname: userInfo?.user?.lastname || "",
 });

 const toggleEdit = () => setEditable(!editable);

 const handleInputChange = (name, value) =>
   setUpdatedData({ ...updatedData, [name]: value });

 const saveProfile = async () => {
  try {
    const response = await axios.put(
      `${RESP_URL}/api/users/${userInfo?.user?._id}/update`,
      updatedData,
      { headers: { Authorization: `Bearer ${userInfo?.token}` } }
    );

    if (response.status === 200) {
      console.log("Profile updated:", response.data);

      // Update AuthContext with new data (merge updated fields)
      updateUserInfo({
        ...userInfo.user,        // Keep existing fields
        ...response.data,        // Overwrite with updated fields
      });

      setEditable(false); // Disable edit mode after saving
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};


 const handleProfilePicChange = () => {
   Alert.alert("Change Profile Picture", "Profile picture editing is tapped!");
 };

 return (
   <View style={styles.container}>
     <Text style={styles.header}>Perfil</Text>
     <Pressable onPress={handleProfilePicChange}>
       <Image
         source={
           userInfo?.user?.profile_pic
             ? { uri: userInfo.user.profile_pic }
             : require("../../assets/images/profile_picture_ph.png")
         }
         style={styles.profilePic}
       />
     </Pressable>

     <Text style={styles.label}>User ID:</Text>
     <Text style={styles.text}>{userInfo?.user?._id}</Text>

     <View style={styles.editRow}>
       <Text style={styles.label}>Email:</Text>
       <Pressable onPress={toggleEdit}>
         <MaterialIcons name="edit" size={20} color="gray" />
       </Pressable>
     </View>
     {editable ? (
       <TextInput
         style={styles.input}
         value={updatedData.email}
         onChangeText={(text) => handleInputChange("email", text)}
       />
     ) : (
       <Text style={styles.text}>{userInfo?.user?.email}</Text>
     )}

     <View style={styles.editRow}>
       <Text style={styles.label}>Nombre:</Text>
       <Pressable onPress={toggleEdit}>
         <MaterialIcons name="edit" size={20} color="gray" />
       </Pressable>
     </View>
     {editable ? (
       <TextInput
         style={styles.input}
         value={updatedData.firstname}
         onChangeText={(text) => handleInputChange("firstname", text)}
       />
     ) : (
       <Text style={styles.text}>{userInfo?.user?.firstname || "N/A"}</Text>
     )}

     <View style={styles.editRow}>
       <Text style={styles.label}>Apellido:</Text>
       <Pressable onPress={toggleEdit}>
         <MaterialIcons name="edit" size={20} color="gray" />
       </Pressable>
     </View>
     {editable ? (
       <TextInput
         style={styles.input}
         value={updatedData.lastname}
         onChangeText={(text) => handleInputChange("lastname", text)}
       />
     ) : (
       <Text style={styles.text}>{userInfo?.user?.lastname || "N/A"}</Text>
     )}

     {editable && (
       <Pressable style={styles.saveButton} onPress={saveProfile}>
         <Text style={styles.saveText}>Guardar</Text>
       </Pressable>
     )}
   </View>
 );
};

export default Profile;

const styles = StyleSheet.create({
 container: {
   flex: 1,
   padding: 8,
   justifyContent: "center",
   alignItems: "center",
 },
 header: {
   fontSize: 24,
   marginBottom: 16,
 },
 profilePic: {
   width: 80,
   height: 80,
   borderRadius: 40,
   marginBottom: 12,
 },
 label: {
   fontWeight: "bold",
   marginTop: 4,
 },
 text: {
   fontSize: 14,
   marginBottom: 4,
   textAlign: "center",
 },
 input: {
   borderWidth: 1,
   borderColor: "gray",
   borderRadius: 4,
   padding: 8,
   width: "100%",
   marginBottom: 8,
   textAlign: "center",
 },
 editRow: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "center",
   marginBottom: 4,
 },
 saveButton: {
   backgroundColor: "blue",
   padding: 10,
   borderRadius: 4,
   marginTop: 12,
 },
 saveText: {
   color: "white",
   fontWeight: "bold",
 },
});
