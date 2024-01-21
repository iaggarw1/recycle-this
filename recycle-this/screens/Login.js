mport React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { Button, TextInput, ActivityIndicator, MD2Colors } from 'react-native-paper';


function Login() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
    <Image source={require('../logo.png')} style={styles.logo}/>
      <TextInput style={styles.textboxes} autoCapitalize='none' placeholder='Email' onChangeText={(username) => setUsername(username)} value={username}></TextInput>
      <TextInput style={styles.textboxes} autoCapitalize='none' placeholder='Password' onChangeText={(password) => setPassword(password)} value={password}></TextInput>
      <Button mode='contained' onPress={handleSubmit} style={styles.button}>
        Sign In
      </Button>
      <Button mode='contained' onPress={handleSubmit} style={styles.button}>
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