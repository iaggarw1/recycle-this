import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, SafeAreaView, Button, Image  } from 'react-native';
import { Camera, CameraType, requestCameraPermissionsAsync, getCameraPermissionsAsync, WhiteBalance,  } from 'expo-camera';
import { FontAwesome } from 'react-native-vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { shareAsync } from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { Alert } from 'react-native';
import FileSystem from 'react-native-filesystem';

const CameraScan = ( { onHide }) => {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  const recyclableMaterials = ['plastic', 'glass', 'paper', 'metal']; // List of recyclable material types

  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
  
    try {
      let newPhoto = await cameraRef.current.takePictureAsync(options);
      let item_data = await query(newPhoto); // Assuming this returns an array of objects with label and score
  
      setPhoto(newPhoto); // Update state with the new photo
      console.log(newPhoto.uri); // Log the URI of the new photo
  
      // Analyze the item data to determine if it's recyclable, disposable, or not identifiable
      const recyclableMaterials = ['plastic', 'glass', 'paper', 'metal'];
      let recyclableScore = 0;
      let otherScore = 0;
      let isIdentifiable = true;
      
      // Sum the scores for recyclable materials and 'others'
      item_data.forEach(item => {
        if (recyclableMaterials.includes(item.label.toLowerCase())) {
          recyclableScore += item.score;
        } else if (item.label.toLowerCase() === 'others') {
          otherScore += item.score;
        }
      });
      
      // Determine the recyclability of the item
      if (recyclableScore > otherScore) {
        Alert.alert("Recyclable", "This item is recyclable. Please move to the closest recycling bin to recycle it.");
      } else if (otherScore > recyclableScore) {
        Alert.alert("Disposable", "This item is disposable. Please dispose of it in the nearest waste bin.");
      } else {
        // Check if the scores are close to each other, implying non-identifiability
        const threshold = 0.1; // Define a threshold for score differences
        isIdentifiable = !item_data.some(item => Math.abs(item.score - (1 / item_data.length)) > threshold);
        
        if (isIdentifiable) {
          Alert.alert("Unidentifiable", "The item is not able to be identified as recyclable or disposable.");
        } else {
          Alert.alert("Indeterminate", "This item is mixed and cannot be determined.");
        }
      }
    } catch (error) {
      console.error('Error taking picture or querying item type:', error);
    }
  };
  

try{
  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

  }
} catch (error)
{

};


  return (
    <Camera style={styles.camera} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.takePicButton} onPress={takePic}>
          <Text style={styles.takePicText}>Capture</Text>
        </TouchableOpacity>
      </View>
    </Camera>
  );
};
function getLabelOfHighestScore(data) {
  if (!Array.isArray(data)) {
    console.error('Invalid data: expected an array');
    return;
  }

  const highestScoreLabel = data.reduce((highest, current) => {
    console.log(`In function: ${(current.score > highest.score) ? current : highest}`);
    return (current.score > highest.score) ? current : highest;
  }, { score: -Infinity }); // Start with a lowest possible score

  console.log(`Exiting function: ${highestScoreLabel.label}`);
  return highestScoreLabel.label;
}



const uploadImageToModel = async (imageUri) => {
  console.log("Uploading image to model's endpoint");
  const data = new FormData();
  data.append("photo", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  });


};
async function query(uri){
    try {

        const response = await fetch("https://api-inference.huggingface.co/models/pyesonekyaw/recycletree_materials", 
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: uri,
        }
        );
        
        var json;
        const result = await response.json().then((result)=>{
            console.log(result);
            json = result;
        });
        console.log(json[0].label);
        
        return json;
      } catch (error) {
        console.error(error);
      }
}
//   const [type, setType] = useState(CameraType.back);
//   const [permission, requestPermission] = Camera.useCameraPermissions();

//   function toggleCameraType() {
//     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
//   }

//   useEffect(() => {
//     (async () => {
//       if (!permission) {
//         await requestPermission();
//       }
//     })();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Camera>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'transparent',
//             justifyContent: 'flex-end',
//             alignItems: 'center',
//             marginBottom: 20,
//           }}>
//           <TouchableOpacity onPress={toggleCameraType}>
//             <FontAwesome name="camera" size={50} color="white" />
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%', 
    height: '100%', 
  },
  takePicButton: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
    marginBottom: 600,
    marginRight: 300,
    left: 150,
    top: 550,
  },
  preview: {
    width: '200%', 
    height: '200%', 
    position: 'absolute',
  },
});

export default CameraScan;