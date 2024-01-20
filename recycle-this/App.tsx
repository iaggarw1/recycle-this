import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Voice from '@react-native-voice/voice';
import React, {Component} from 'react';
import React from 'react';
import HomeScreen from './screens/HomeScreen';

export default function App() {

  return <HomeScreen />;

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
