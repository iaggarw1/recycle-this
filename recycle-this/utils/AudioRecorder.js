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

};

export default AudioRecorder;