import React, { useEffect, useState, useRef } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity, Text, SafeAreaView, Alert, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import getLocation from '../utils/getLocation';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { FontAwesome } from 'react-native-vector-icons';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import CameraScan from '../CameraScan';



const GOOGLE_CLOUD_API_KEY = 'AIzaSyDy6DQJ1lr29xJPQ0DgagixGE5Tim5eJ90';
const GOOGLE_CLOUD_SPEECH_API_URL = 'https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyDy6DQJ1lr29xJPQ0DgagixGE5Tim5eJ90';

const binLocations = [{name: "Stevenson Service Rd", latitude: 36.9968, longitude: -122.05191},
{name: "Stevenson College", latitude: 36.99708, longitude: -122.05211},
{name: "Stevenson Coffee House", latitude: 36.9973, longitude: -122.05227},
{name: "Stevenson Coffee House", latitude: 36.99736, longitude: -122.05236},
{name: "Casa Quarta", latitude: 36.99725, longitude: -122.05127},
{name: "Near Casa Octava", latitude: 36.99666, longitude: -122.05216},
{name: "Stevenson Apartments", latitude: 36.99633, longitude: -122.0523},
{name: "Cowell Service Rd", latitude: 36.99636, longitude: -122.0538},
{name: "Cowell College", latitude: 36.99658, longitude: -122.05377},
{name: "Parrington House", latitude: 36.99644, longitude: -122.05425},
{name: "Cowell-College Apartment No.3", latitude: 36.99627, longitude: -122.05444},
{name: "Casa Segunda", latitude: 36.99791, longitude: -122.05111},
{name: "Humanities & Social Science Building", latitude: 36.99835, longitude: -122.05512},
{name: "McHenry Library", latitude: 36.99533, longitude:  -122.05919},
{name: "Academic Resources Center", latitude: 36.99428, longitude: -122.05933},
{name: "Baskin Engineering", latitude: 37.00014, longitude: -122.06301}];


const HomeScreen = () => {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [location, setLocation] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [directions, setDirections] = useState(null);
  const [showDirections, setShowDirections] = useState(false);


  const toggleCamera = () => {
    setShowCamera(!showCamera);

    console.log("Toggling camera, showCamera:", !showCamera);
  };

  takePic = async () => {
    
    let options = {
      quality: 0.5, // adjust the quality for performance
      base64: true,
      exif: false,
    };
    console.log("loc 121")
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    console.log("loc 15")
    setPhoto(newPhoto);
    console.log("loc 13")
    await uploadImageToModel(newPhoto.uri);
    console.log("loc 2")
  };
  
  // upload image to model's endpoint

  const uploadImageToModel = async (imageUri) => {
    console.log("loc 1")
    const data = new FormData();
    data.append("photo", {
      uri: imageUri,
      type: "image/jpeg", 
      name: "upload.jpg", 
    });

    try {
      const response = await fetch("https://api-inference.huggingface.co/models/Giecom/giecom-vit-model-clasification-waste", 
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: data,
      }
      );

      const result = await response.json();
      console.log("ishaan I blame you for everything")


      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  
  const convertAudioToBase64 = async (uri) => {
    try {
      const audioData = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      return audioData;
    } catch (error) {
      console.error("Error converting audio to Base64");
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
        // Process the response
        const transcription = response.data.results
          .map(result => result.alternatives[0].transcript)
          .join('\n');
        return transcription;
      } else {
        console.log('No transcription results.');
        return null;
      }
    } catch (error) {
      console.error('Error calling Google Speech-to-Text API:', error);
    }
  };
  

  async function startRecording() {
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
  }

  async function stopRecording() {
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
    console.log(transcription);
    console.log("all recordings: ", allRecordings)
  }

  function clearRecordings() {
    setRecordings([]);
  }

  useEffect(() => {
    const fetchLocation = async () => {
      const loc = await getLocation();
      setLocation(loc);
    };

    fetchLocation();
  }, []);


  const generateDirectionURL = (destination) => {

    const userLatitude = location.coords.latitude;
    const userLongitude = location.coords.longitude;
    const destLatitude = destination.latitude;
    const destLongitude = destination.longitude;

    return `https://maps.googleapis.com/maps/api/directions/json?origin=${userLatitude},${userLongitude}&destination=${destLatitude},${destLongitude}&key=${GOOGLE_CLOUD_API_KEY}`;

  }

  const fetchDirections = async (destination) => {
    try {
      const url = generateDirectionURL(destination);
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes.length) {
        setDirections(data.routes[0].legs[0]); 
      }
    } catch (error) {
      console.error(error);
    }
  };

  const openGoogleMaps = (destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=walking`;
    Linking.openURL(url);
  };


  const handlePress = async () => {
    // Check and request permission
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission for audio recording not granted");
      return;
    }

    // If permission is granted, start or stop recording based on the current state
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }

    console.log("Pressed");
  };

  const playRecording = async (uri) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: uri });
      await sound.playAsync();
    } catch (error) {
      console.error("Couldn't play the recording. Error:", error);
    }
  };

  const handleBinMarkerPress = async (binLocation) => {
    console.log("Recycling bin at:", binLocation.name);
    await fetchDirections(binLocation);
    // Additional actions can be performed here
  };

  return (
    <View style={styles.container}>
      {directions && (
        <View>
          <Text style={styles.directionsText}>Distance: {directions.distance.text}</Text>
          <Text style={styles.directionsText}>Duration: {directions.duration.text}</Text>
          <TouchableOpacity
            style={styles.navigateButton}
            onPress={() => openGoogleMaps(directions.end_location)}
          >
            <Text styles={styles.directionsText}>Open in Maps</Text>
          </TouchableOpacity>
        </View>
      )}

      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0011,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"Your Location"}
          />
          {/* Markers for recycling bins */}
          {binLocations.map((binLocation, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: binLocation.latitude,
                longitude: binLocation.longitude,
              }}
              title={binLocation.name}
              onPress={() => handleBinMarkerPress(binLocation)}
            >
              {/* Custom recycling bin icon */}
              <Icon name="recycling" size={30} color="green" />
            </Marker>
          ))}
        </MapView>
      )}

      {/* {showCamera && (
        <Camera style={styles.camera} ref={cameraRef}>
          <View style={styles.cameraContent}>
            <TouchableOpacity onPress={takePic} style={styles.cameraButton}>
              <FontAwesome name="camera" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </Camera>
      )} */}

      <View style={styles.container}>
        <TouchableOpacity onPress={toggleCamera} style={styles.cameraButton}>
          <Icon name="camera-alt" size={30} color="#FFF" />
          {showCamera && <CameraScan />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.micButton} onPress={handlePress}>
        <Icon name="mic" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* {recordings.length > 0 && 
        <View style={styles.playButton}>
          <Button
            title="Play Last Recording"
            onPress={() =>
              playRecording(recordings[recordings.length - 1].file)
            }
          />
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  micButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "left",
    backgroundColor: "green", 
    borderRadius: 30,
    left: 20,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraButton: {
    position: "absolute",
    backgroundColor: "green",
    bottom: 110,
    right: 20,
    padding: 15,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
   
  },

  navigateButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },

  directionsText:{
    color:'black',
    fontSize:20,
  }

});

export default HomeScreen;