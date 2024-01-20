// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAudioRecorder } from '../components/AudioRecorder'; // Adjust the path as necessary
import { useLocationService } from '../components/LocationService'; // Adjust the path as necessary

const HomeScreen = () => {
  const { recording, startRecording, stopRecording, playRecording, recordings } = useAudioRecorder();
  const location = useLocationService();

  const handlePress = async () => {
    if (recording) {
      const transcription = await stopRecording();
      console.log(transcription);
    } else {
      startRecording();
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
    backgroundColor: '#007AFF',
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
    // Additional styling if needed
  }
});

export default HomeScreen;
