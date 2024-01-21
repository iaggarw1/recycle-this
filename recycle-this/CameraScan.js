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

  const takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options).then((phot)=>{
        query(phot).then(()=>{
            console.log('PLEASe')
        })
    })
    setPhoto(newPhoto);
    
    console.log(newPhoto.uri); 
  };


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

async function query(uri){
    try {

        const response = await fetch("https://api-inference.huggingface.co/models/pyesonekyaw/recycletree_materials", 
        {
          headers: { Authorization: "Bearer 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" },
          method: "POST",
          body: uri,
        }
        );
  
        const result = await response.json().then((result)=>{
            console.log(result);
        });
        console.log("ishaan I blame you for everything")
        
  
        
        return result;
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