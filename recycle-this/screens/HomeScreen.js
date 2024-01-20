import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import getLocation from '../utils/getLocation';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import Icon
import { Audio } from 'expo-av';

const HomeScreen = () => {
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [location, setLocation] = useState(null);


  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        });
        const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        setRecording(recording);
        console.log("recording started");
      }
    } catch (err) {}
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

  return (
    <View style={styles.container}>
      
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"Your Location"}
          />
        </MapView>
      )}

      {/* Circular Button with Microphone Icon */}
      <TouchableOpacity style={styles.micButton} onPress={handlePress}>
        <Icon name="mic" size={30} color="#FFF" />
      </TouchableOpacity>
      {recordings.length > 0 && (
      <View style={styles.playButton}>
        <Button
          title="Play Last Recording"
          onPress={() => playRecording(recordings[recordings.length - 1].file)}
        />
      </View>
    )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  micButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF', // Change as per your preference
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButton: {
    position: 'absolute',
    paddingTop: 50,
    
  }
  
  
});

export default HomeScreen;