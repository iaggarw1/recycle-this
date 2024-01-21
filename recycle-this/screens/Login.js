import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, TextInput } from 'react-native-paper';
import axios from 'axios';
import CreateAccount from './CreateAccount';

function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://test-8wlq.onrender.com/api/user/login', {
        email,
        password
      });
      // Handle login response here
      if (response.status === 200) {
        Alert.alert("Login Successful");
        navigation.navigate('Home');
      } else {
        Alert.alert("Login Failed");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("An error occurred during login", error.message);
    }
  };

  const handleSignup = async () => {
    navigation.navigate(CreateAccount);

    try {
      const response = await axios.post('https://test-8wlq.onrender.com/api/user/register', {
        email,
        password
      });
      // Handle signup response here
      if (response.status === 200) {
        Alert.alert("Signup Successful");
        // Optional: Navigate to a different screen
        // navigation.navigate('SomeOtherScreen');
      } else {
        Alert.alert("Signup Failed");
      }
    } catch (error) {
      console.log(error);
      
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../logo.png')} style={styles.logo} />
      <TextInput
        style={styles.textboxes}
        autoCapitalize='none'
        placeholder='Email'
        onChangeText={setEmail}  // Corrected from setUsername to setEmail
        value={email}           // Corrected from username to email
      />
      <TextInput
        style={styles.textboxes}
        autoCapitalize='none'
        secureTextEntry={true}
        placeholder='Password'
        onChangeText={setPassword}
        value={password}
      />
      <Button mode='contained' onPress={handleLogin} style={styles.button}>
        Sign In
      </Button>
      <Button mode='contained' onPress={handleSignup} style={styles.button}>
        Create Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    marginTop: 10,
  },
  textboxes: {
    marginTop: 15,
  },
  button: {
    marginTop: 15,
    paddingVertical: 8,
  },
  logo: {
    width: 390,
    height: 390,
    resizeMode: "contain",
    marginBottom: 30,
  },
});

export default Login;