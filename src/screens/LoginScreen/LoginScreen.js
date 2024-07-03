import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { styles } from "./LoginScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { app } from "../../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../../App";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setUserToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const handleEmailLogin = () => {
    setLoginLoading(true);
    console.log("Email Login", email, password);
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User", user);
        // ...
        user.getIdToken().then((token) => {
          console.log("Token", token);
          setUserToken(token);
          setEmail("");
          setPassword("");
          // Navigate to profile screen
          setLoginLoading(false);
          navigation.navigate("Profile");
        });
      })
      .catch((error) => {
        console.log("Error", error.code, error.message);
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoginLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    console.log("Google Login");
  };

  const handleFacebookLogin = () => {
    console.log("Facebook Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleEmailLogin}
        disabled={loginLoading}
      >
        <Text style={styles.buttonText}>
          {loginLoading ? "Logging In..." : "Log In with Email"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.buttonText}>Log In with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.facebookButton}
        onPress={handleFacebookLogin}
      >
        <Text style={styles.buttonText}>Log In with Facebook</Text>
      </TouchableOpacity>
      {/* add link to registration page */}
      <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
        <Text>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
}
