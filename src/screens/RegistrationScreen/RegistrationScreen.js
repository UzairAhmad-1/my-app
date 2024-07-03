import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { styles } from "./RegistrationScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { app } from "../../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { AuthContext } from "../../../App";
import { createUser } from "../../../api/users.api";
import firebase from "firebase/compat/app";

export default function RegistrationScreen() {
  const navigation = useNavigation();
  const { setUserToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = () => {
    console.log("Email Signup", name, email, password);
    const auth = getAuth(app);
    console.log("Auth: ", auth);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User: ", user);
        updateProfile(user, {
          displayName: name,
        })
          .then(() => {
            console.log("User profile updated");
            user
              .getIdToken()
              .then(async (token) => {
                setUserToken(token);
                await createUser({
                  firebaseId: user.uid,
                  name: name,
                  email: email,
                })
                  .then((response) => {
                    console.log("User created", response.data);
                  })
                  .catch((error) => {
                    console.error("Error creating user", error);
                  });
                setName("");
                setEmail("");
                setPassword("");
                navigation.navigate("Profile");
              })
              .catch((error) => {
                console.error("Error getting user token", error);
              });
          })
          .catch((error) => {
            console.error("Error updating user profile", error);
          });
      })
      .catch((error) => {
        console.log("Error: ", error);
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  const handleGoogleSignup = () => {
    console.log("Google Signup");
  };

  const handleFacebookSignup = () => {
    console.log("Facebook Signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
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
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailSignup}>
        <Text style={styles.buttonText}>Sign Up with Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignup}
      >
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.facebookButton}
        onPress={handleFacebookSignup}
      >
        <Text style={styles.buttonText}>Sign Up with Facebook</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text>Already have an account? Login.</Text>
      </TouchableOpacity>
    </View>
  );
}
