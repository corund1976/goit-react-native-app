import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import * as Location from 'expo-location';

// import * as MediaLibrary from "expo-media-library";

export default function Home() {
  const [state, setState] = useState(null);

  const [hasPermissionCamera, setHasPermissionCamera] = useState(null);
  const [hasPermissionLocation, setHasPermissionLocation] = useState(null);

  const [cameraRef, setCameraRef] = useState(null);
  const [typeCamera, setTypeCamera] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      // const { status } = await Camera.requestCameraPermissionsAsync();
      let cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasPermissionCamera(cameraPermission.status === 'granted');

      let locationPermission = await Location.requestForegroundPermissionsAsync();
      setHasPermissionLocation(locationPermission.status === 'granted');

      // await MediaLibrary.requestPermissionsAsync();
      // setHasPermissionCamera(status === "granted");
    })();
  }, []);

  if (hasPermissionCamera === null) {
    return <View />;
  }
  if (hasPermissionCamera === false) {
    return <Text>No access to camera</Text>;
  }

  if (hasPermissionLocation === null) {
    return <View />;
  }
  if (hasPermissionLocation === false) {
    return <Text>No access to location</Text>;
  }

  console.log('state #32', state);

  const takePhoto = async () => {
    if (cameraRef) {
      const picture = await cameraRef.takePictureAsync();
      const location = await Location.getCurrentPositionAsync({});

      setState(prevState => ({
        ...prevState,
        photo: picture.uri,
        id: Date.now().toString(),
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      }));
    }
  }


  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={typeCamera}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.photoView}>
          <TouchableOpacity
            style={styles.flipContainer}
            onPress={() => {
              setTypeCamera(
                typeCamera === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
              {" "}
              Flip{" "}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
          >
            <View style={styles.takePhotoOut}>
              <View style={styles.takePhotoInner}></View>
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  photoView: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },

  flipContainer: {
    flex: 0.1,
    alignSelf: "flex-end",
  },

  button: { alignSelf: "center" },

  takePhotoOut: {
    borderWidth: 2,
    borderColor: "white",
    height: 50,
    width: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  takePhotoInner: {
    borderWidth: 2,
    borderColor: "white",
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 50,
  },
});