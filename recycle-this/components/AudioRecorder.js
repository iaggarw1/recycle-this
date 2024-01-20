// AudioRecorder.js
import { useState } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

const GOOGLE_CLOUD_API_KEY = 'AIzaSyDy6DQJ1lr29xJPQ0DgagixGE5Tim5eJ90';
const GOOGLE_CLOUD_SPEECH_API_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`;

export const useAudioRecorder = () => {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);

  const convertAudioToBase64 = async (uri) => {
    try {
      const audioData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return audioData;
    } catch (error) {
      console.error("Error converting audio to Base64:", error);
    }
  };

  const sendAudioToSpeechToTextAPI = async (base64Audio) => {
    try {
      const response = await axios.post(
        GOOGLE_CLOUD_SPEECH_API_URL,
        {
          config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 44100,
            languageCode: 'en-US',
          },
          audio: {
            content: base64Audio,
          },
        }
      );
  
      if (response.data && response.data.results) {
        const transcription = response.data.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        return transcription;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error calling Google Speech-to-Text API:', error);
      return null;
    }
  };

  const startRecording = async () => {
    // Permissions and audio mode setup
    // Start recording logic
    try {
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status === "granted") {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
  
          const recording = new Audio.Recording();
  
          try {
            await recording.prepareToRecordAsync({
              android: {
                extension: '.wav',
                outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_DEFAULT,
                audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 128000,
              },
              ios: {
                extension: '.wav',
                audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
                sampleRate: 44100,
                numberOfChannels: 1,
                bitRate: 128000,
                linearPCMBitDepth: 16,
                linearPCMIsBigEndian: false,
                linearPCMIsFloat: false,
              },
            });
            await recording.startAsync();
            setRecording(recording);
            console.log("Recording started");
          } catch (error) {
            console.log("Failed to start recording:", error);
          }
        }
      } catch (error) {
        console.log("Permission for audio recording not granted:", error);
      }
  };

  const stopRecording = async () => {
    // Stop recording logic
    // Process recording and convert to Base64
    // Send to Speech-to-Text API
    setRecording(undefined);

    await recording.stopAndUnloadAsync();
    console.log("recording stopped")
    let allRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    allRecordings.push({
      sound: sound,
      file: recording.getURI(),
    });

    setRecordings(allRecordings);
    const uri = recording.getURI();
    const base64Audio = await convertAudioToBase64(uri);

    const transcription = await sendAudioToSpeechToTextAPI(base64Audio);
  };

  const playRecording = async (uri) => {
    // Play recording logic
    try {
        const { sound } = await Audio.Sound.createAsync({ uri: uri });
        await sound.playAsync();
      } catch (error) {
        console.error("Couldn't play the recording. Error:", error);
      }
  };

  return {
    recording,
    startRecording,
    stopRecording,
    playRecording,
    recordings,
  };
};
