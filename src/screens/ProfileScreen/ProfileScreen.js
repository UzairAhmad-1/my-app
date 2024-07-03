import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../../App";
import { getAuth, updateProfile } from "firebase/auth";
import { app } from "../../firebaseConfig";
import { getUser, updateUser } from "../../../api/users.api";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { userToken, setUserToken } = useContext(AuthContext);
  const navigation = useNavigation();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [firebaseId, setFirebaseId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const auth = getAuth(app);
    const user = auth.currentUser;

    if (user) {
      console.log("User:", user);
      setFirebaseId(user?.uid);
      setProfilePhoto(user?.photoURL);
      setName(user?.displayName);
      setEmail(user?.email);

      getUserData(user?.uid);
    }
  }, [userToken]);

  useEffect(() => {
    console.log("Photo: ", profilePhoto);
  }, [profilePhoto]);

  const getUserData = async (id) => {
    console.log("Id: ", id);
    try {
      const response = await getUser(id);
      console.log("User Data:", response.data);
      setBio(response?.data?.bio);
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Photo: ", result);

    if (!result.canceled) {
      console.log("Photo URI:", result.assets[0].uri);
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleUpdate = () => {
    // Handle profile update logic here
    console.log("Profile Updated:", { profilePhoto, name, email, bio });
    updateProfile(getAuth(app).currentUser, {
      displayName: name,
      email: email,
      // photoURL: profilePhoto,
    })
      .then(async () => {
        console.log("User profile updated in firebase");
        const data = new FormData();
        await updateUser(firebaseId, {
          // profilePhoto: profilePhoto,
          name: name,
          email: email,
          bio: bio,
        })
          .then((response) => {
            console.log("User profile updated in database", response.data);
          })
          .catch((error) => {
            console.error("Error updating user profile in database", error);
          });
      })
      .catch((error) => {
        console.error("Error updating user profile", error);
      });
  };

  const handleLogout = () => {
    setUserToken(null);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage}>
        {profilePhoto ? (
          <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
        ) : (
          <View style={styles.profilePhotoPlaceholder}>
            <Text style={styles.profilePhotoText}>Pick an Image</Text>
          </View>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profilePhotoText: {
    color: "#fff",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
