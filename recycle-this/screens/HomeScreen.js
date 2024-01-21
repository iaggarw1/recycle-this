import React from 'react';
import { View, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAudioRecorder } from '../components/AudioRecorder'; // Adjust the path as necessary
import { useLocationService } from '../components/LocationService'; // Adjust the path as necessary

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
  const { recording, startRecording, stopRecording, playRecording, recordings } = useAudioRecorder();
  const location = useLocationService();

  const handlePress = async () => {
    if (recording) {
      const transcription = await stopRecording();
      // From here, pass transcription to Model

      // Get token from model

      // Evaluate token

      // Text to Speech Pre-recorded directions to dispose.

      // Show closest recycling bin if needed
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