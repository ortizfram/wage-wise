import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { RESP_URL } from '../../config';
import { useRouter } from 'expo-router';

const CreateOrganizationView = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const { userInfo } = useContext(AuthContext);

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      Alert.alert('Validation Error', 'Organization name is required');
      return;
    }

    // Prepare data for submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('userId', userInfo._id);

    if (imageUri) {
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg', // Adjust the type according to your image format
        name: 'organization-image.jpg',
      });
    }

    try {
      const response = await axios.post(`${RESP_URL}/api/organization`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${userInfo.token}`
        }
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Organization created successfully');
        setName('');
        setImageUri(null);
        router.push("/");
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to create organization');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create an Organization</Text>
      <TextInput
        style={styles.input}
        placeholder="Organization name"
        value={name}
        onChangeText={setName}
      />
      <Pressable onPress={handleChooseImage} style={styles.imagePicker}>
        <Text style={styles.imageText}>🏞️ Choose an image</Text>
      </Pressable>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  imagePicker: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  imageText: {
    color: '#007bff',
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 16,
  },
});

export default CreateOrganizationView;
