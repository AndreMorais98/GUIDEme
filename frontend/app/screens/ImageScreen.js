import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { ImageBrowser } from 'expo-image-picker-multiple';
import {
  NativeBaseProvider,
  Box,
  HStack,
  StatusBar,
  IconButton,
  Button,
  Icon as NativeBaseIcon,
  Icon,
} from 'native-base';
import { firebaseConfig } from '../firebase';
import * as Firebase from 'firebase';
import { MaterialIcons } from '@expo/vector-icons';
/**
 * @description - This function is used to render the tab bar
 * @param {object} props - props
 * @return {JSX} JSX
 * @memberof ForgotPass
 */
const ImageScreen = ({ navigation, route }) => {
  const [cPhotos, setCPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(false);
  const { token, photos } = route.params;
  if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig);
  }

  const uploadImage = async image => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', image, true);
      xhr.send(null);
    });

    const ref = Firebase.storage().ref().child(new Date().toISOString());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  imagesCallback = callback => {
    setDisable(true);
    callback
      .then(async photos => {
        const cPhotos = [];
        for (const photo of photos) {
          const pPhoto = await _processImageAsync(photo.uri);
          cPhotos.push({
            uri: pPhoto.uri,
            name: photo.filename,
            type: 'image/jpg',
          });
        }
        setCPhotos(cPhotos);
        setDisable(false);
      })
      .catch(e => console.log(e));
  };

  const _processImageAsync = async uri => {
    const file = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 1000 } }], {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    return file;
  };

  updateHandler = (count, onSubmit) => {
    // this.props.navigation.setOptions({
    //  title: `Selected ${count} files`,
    //  headerRight: () => _renderDoneButton(count, onSubmit),
    // });

    onSubmit();
  };

  const sendPhotos = async () => {
    setLoading(true);
    const firebaseArr = [];
    for (const photo of cPhotos) {
      const link = await uploadImage(photo.uri);
      firebaseArr.push(link);
    }

    setLoading(false);
    return firebaseArr;
  };

  /**
   * @description - This function is used to render the tab bar
   * @param {object} props - props
   * @return {JSX} JSX
   * @memberof ForgotPass
   */
  const renderSelectedComponent = number => (
    <View style={styles.countBadge}>
      <Text style={styles.countBadgeText}>{number}</Text>
    </View>
  );
  const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;

  return (
    <NativeBaseProvider>
      <StatusBar backgroundColor="#c2410c" barStyle="light-content" />

      <Box safeAreaTop />

      <HStack px="1" py="3" justifyContent="space-between" alignItems="center">
        <HStack space="2">
          <IconButton
            icon={
              <Icon
                as={<MaterialIcons name="keyboard-backspace" />}
                size="md"
                color="black"
                onPress={() => {
                  navigation.navigate('SignIn', {});
                }}
              />
            }
          />
        </HStack>
        <HStack space="4" alignItems="center">
          <Button
            isLoading={loading}
            isDisabled={disable}
            isLoadingText="Submitting"
            onPress={async () => {
              const firebaseArr = await sendPhotos();
              navigation.navigate('ExpForm', { token: token, photos: firebaseArr });
            }}
          >
            Save
          </Button>
        </HStack>
      </HStack>
      <View style={[styles.flex, styles.container]}>
        <ImageBrowser
          max={4}
          onChange={updateHandler}
          callback={imagesCallback}
          renderSelectedComponent={renderSelectedComponent}
          emptyStayComponent={emptyStayComponent}
        />
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    position: 'relative',
  },
  emptyStay: {
    textAlign: 'center',
  },
  countBadge: {
    paddingHorizontal: 8.6,
    paddingVertical: 5,
    borderRadius: 50,
    position: 'absolute',
    right: 3,
    bottom: 3,
    justifyContent: 'center',
    backgroundColor: '#0580FF',
  },
  countBadgeText: {
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 'auto',
    color: '#ffffff',
  },
});
export default ImageScreen;
