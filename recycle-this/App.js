import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, Icon } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import HomeScreen from './screens/HomeScreen';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { FontAwesome } from 'react-native-vector-icons';
import Login from './screens/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import CreateAccount from './screens/CreateAccount';

const Stack = createNativeStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={Login} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;