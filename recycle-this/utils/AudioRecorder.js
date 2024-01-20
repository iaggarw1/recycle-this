import React, { useState, useEffect } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';


const AudioRecorder = () => {
    const [recording, setRecording] = useState();
    const [recordedUri, setRecordedUri] = useState(null);

    useEffect(() => {
      return () => {
        if (recording) {
          recording.stopAndUnloadAsync();
        }
      };
    }, [recording]);

    const startRecording = async () => {
      try {
        // Check or request permission
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // Prepare recording
        const newRecording = new Audio.Recording();
        await newRecording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        await newRecording.startAsync();

        setRecording(newRecording);

      } catch (error) {
        console.error("Failed to start recording", error);
      }
    };

    const stopRecording = async () => {
      if (!recording) {
        return;
      }
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(undefined);
        setRecordedUri(uri);
        console.log('Recording stopped and stored at', uri);
      } catch (error) {
        console.error('Failed to stop recording', error);
      }
    };

  };


  export default AudioRecorder;