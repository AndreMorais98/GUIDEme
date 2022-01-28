import React, { useEffect, useState, useRef } from 'react';
import {
  NativeBaseProvider,
  Box,
  View,
  HStack,
  Avatar,
  StatusBar,
  IconButton,
  VStack,
  CloseIcon,
  Button,
  Input,
  TextArea,
  WarningOutlineIcon,
  FormControl,
  Alert,
  Text,
  Link,
  Collapse,
  Icon as NativeBaseIcon,
  extendTheme,
  ScrollView,
} from 'native-base';
import { StyleSheet, Dimensions, ImageBackground } from 'react-native';

import { firebaseConfig } from '../firebase';
import * as Firebase from 'firebase';

import PropTypes from 'prop-types';
import appTheme from '../constants/theme';
import { Footer } from '../components/footer';
import { MaterialIcons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('screen');

const Edit = ({ navigation, route }) => {
  const { token } = route.params;
  const [user, setUser] = React.useState({});
  const [formData, setFormData] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const phoneInput = useRef(null);
  const [phoneInputt, setPhoneInputt] = useState(null);
  const [errorsPhone, setErrorsPhone] = React.useState('');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = React.useState('');
  const [image, setImage] = useState(null);
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

  const handleClick = () => setShow(!show);
  const [urlProfile, setUrlProfile] = React.useState('');
  const [urlHeader, setUrlHeader] = React.useState('');

  if (!Firebase.apps.length) {
    Firebase.initializeApp(firebaseConfig);
  }

  function saveChanges() {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
      body: JSON.stringify({
        first_name: !!formData.first_name ? formData.first_name : user.first_name,
        last_name: !!formData.last_name ? formData.last_name : user.last_name,
        country: !!formData.country ? formData.country : user.country,
        district: !!formData.district ? formData.district : user.district,
        description: formData.description,
        phone: !!formData.phone ? formData.phone : user.phone,
        profile_pic: urlProfile,
        header_pic: urlHeader,
      }),
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/edit/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.push('Profile', { token: token });
        } else {
          response
            .json()
            .then(responseJson => {
              if (responseJson.phone) {
                setErrors('Phone:' + responseJson.phone[0]);
              } else if (responseJson.first_name) {
                seterrors('First Name:' + responseJson.first_name[0]);
              } else if (responseJson.last_name) {
                seterrors('Last Name:' + responseJson.last_name[0]);
              } else if (responseJson.country) {
                setErrors('Country:' + responseJson.country[0]);
              } else if (responseJson.district) {
                setErrors('District:' + responseJson.district[0]);
              } else if (responseJson.description) {
                setErrors('Description:' + responseJson.description[0]);
              } else if (responseJson.non_field_errors) {
                setErrors(responseJson.non_field_errors[0]);
              }
              setShow(true);
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function advice(error) {
    if (error) {
      return (
        <Collapse isOpen={show}>
          <Alert w="100%" status="error">
            <VStack space={1} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    _dark={{
                      color: 'coolGray.800',
                    }}
                  >
                    {error}
                  </Text>
                </HStack>
                <IconButton
                  variant="unstyled"
                  icon={<CloseIcon size="3" color="coolGray.600" />}
                  onPress={() => setShow(false)}
                />
              </HStack>
            </VStack>
          </Alert>
        </Collapse>
      );
    } else return null;
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

  const pickHeaderPic = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setLoaded(false);
      const data = await uploadImage(result.uri).catch(error => {
        console.log(error.message);
      });

      setUrlHeader(data);
      setLoaded(true);
    }
  };

  const pickProfilePic = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setLoaded(false);
      const data = await uploadImage(result.uri).catch(error => {
        console.log(error.message);
      });

      setUrlProfile(data);
      setLoaded(true);
    }
  };

  const renderAppBar = () => {
    return (
      <>
        <StatusBar backgroundColor="#c2410c" barStyle="light-content" />
        <Box safeAreaTop />
      </>
    );
  };

  const getUser = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/profile/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setFormData(data);
          setUrlHeader(data.header_pic);
          setUrlProfile(data.profile_pic);
          setLoaded(true);
        } else {
          response
            .json()
            .then(responseJson => {
              console.log(responseJson);
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const renderScrollView = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.backgroundImageContainer}>
          {/* Imagem do header */}
          {loaded ? (
            <ImageBackground
              style={style.backgroundImage}
              source={{
                uri: urlHeader,
              }}
            >
              <HStack space="4" alignItems="center" justifyContent="space-between">
                {/* Go back button */}
                <IconButton
                  icon={
                    <NativeBaseIcon
                      as={<MaterialIcons name="keyboard-backspace" />}
                      size="md"
                      color="black"
                      marginLeft={1}
                      marginTop={1}
                      borderWidth={1}
                      backgroundColor="white"
                      onPress={() => {
                        navigation.navigate('Profile', { token: token });
                      }}
                      style={style.buttonGoBack}
                    />
                  }
                />
              </HStack>
              <View alignItems="center">
                <IconButton
                  style={style.buttonpic}
                  icon={
                    <NativeBaseIcon
                      as={<MaterialIcons name="add-a-photo" />}
                      size="sm"
                      color="black"
                      onPress={pickHeaderPic}
                    />
                  }
                />
              </View>
            </ImageBackground>
          ) : null}
          {/* Foto de perfil */}
          {loaded ? (
            <Avatar
              marginTop={-50}
              marginLeft={5}
              bg="warmGray.50"
              size="xl"
              borderWidth={3}
              borderColor={appTheme.COLORS.white}
              source={{ uri: urlProfile }}
            ></Avatar>
          ) : null}
        </View>

        {/* Botão para salvar definições */}
        <Button
          variant="outline"
          style={{
            marginTop: '2%',
            marginLeft: '70%',
            marginRight: '4%',
          }}
          onPress={saveChanges}
        >
          Save
        </Button>

        <View style={style.detailsContainer}>
          {/* Change Profile Pic */}
          <Link
            _text={{ color: 'blue.400' }}
            isUnderlined={false}
            onPress={pickProfilePic}
            style={{ marginBottom: 15, fontWeight: 18 }}
          >
            Change your Profile Picture
          </Link>

          {advice(errors)}

          {/* First Name */}
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>First Name</FormControl.Label>
            <Input
              variant="outline"
              placeholder={user.first_name}
              style={{ marginBottom: 15 }}
              onChangeText={value => setFormData({ ...formData, first_name: value })}
            />
          </FormControl>

          {/* Last Name */}
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>Last Name</FormControl.Label>
            <Input
              variant="outline"
              placeholder={user.last_name}
              style={{ marginBottom: 15 }}
              onChangeText={value => setFormData({ ...formData, last_name: value })}
            />
          </FormControl>

          {/* District */}
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>District</FormControl.Label>
            <Input
              variant="outline"
              placeholder={user.district}
              style={{ marginBottom: 15 }}
              onChangeText={value => setFormData({ ...formData, district: value })}
            />
          </FormControl>

          {/* Country */}
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>Country</FormControl.Label>
            <Input
              variant="outline"
              placeholder={user.country}
              style={{ marginBottom: 15 }}
              onChangeText={value => setFormData({ ...formData, country: value })}
            />
          </FormControl>

          {/* Description text box */}
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>Description</FormControl.Label>
            <Box w="100%" style={{ marginBottom: 10 }}>
              <TextArea
                aria-label="t1"
                numberOfLines={4}
                onChangeText={value => setFormData({ ...formData, description: value })}
                placeholder={user.description}
                _dark={{
                  placeholderTextColor: 'gray.300',
                }}
              />
            </Box>
          </FormControl>

          {/* Phone Number */}
          {loaded ? (
            <FormControl style={{ marginBottom: 10 }} isInvalid={errorsPhone != ''}>
              <FormControl.Label _text={{ bold: true }}>Phone Number</FormControl.Label>
              <PhoneInput
                ref={phoneInput}
                defaultCode="PT"
                layout="first"
                placeholder={user.phone.substring(4)}
                onChangeText={value => {
                  setFormData({ ...formData, phone: '+' + phoneInput.current.state.code + value });
                  setPhoneInputt(phoneInput);
                }}
                withDarkTheme
                autoFocus
                containerStyle={{
                  width: (90 * viewportWidth) / 100,
                  height: (7.5 * viewportHeight) / 100,
                  backgroundColor: '#F2F3F3',
                  flexDirection: 'row',
                  borderRightWidth: 1,
                  borderLeftWidth: 1,
                  borderTopWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#EAE9EA',
                }}
                textContainerStyle={{
                  backgroundColor: '#F2F3F3',
                }}
              />
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
                _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
              >
                {errorsPhone}
              </FormControl.ErrorMessage>
            </FormControl>
          ) : null}

          {/* Button to change Password */}
          <Button
            style={{ marginBottom: 10 }}
            textAlign="center"
            variant="outline"
            onPress={() => {
              navigation.push('EditPass', { token: token });
            }}
          >
            Change your Password
          </Button>
        </View>
      </ScrollView>
    );
  };

  const theme = extendTheme({
    components: {
      Button: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 'md',
        },
        defaultProps: {
          colorScheme: 'rgb(234, 88, 12)',
        },
      },
      Input: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 'md',
          _focus: {
            borderColor: 'rgb(234, 88, 12)',
          },
        },
        defaultProps: {
          colorScheme: 'rgb(234, 88, 12)',
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="#f5f5f5" safeAreaTop>
        {renderAppBar()}
        {renderScrollView()}
        <Footer select="2" navigation={navigation} token={token} />
      </Box>
    </NativeBaseProvider>
  );
};

Edit.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  categoryListContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 5,
  },
  categoryListText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: appTheme.COLORS.gray,
  },
  activeCategoryListText: {
    color: appTheme.COLORS.black,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  card: {
    height: 250,
    backgroundColor: appTheme.COLORS.white,
    elevation: 10,
    width: width - 130,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: 150,
    top: 0,
  },
  bottomContanier: {
    borderRadius: 50,
    marginTop: 150,
    marginBottom: 16,
    width: '75%',
    marginLeft: '5%',
  },
  bottomContanierButton: {
    height: '80%',
    width: 400,
    backgroundColor: 'white',
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
  buttonGoBack: {
    borderRadius: 32,
    height: 40,
    width: 40,
    opacity: 0.8,
    paddingLeft: 5,
    paddingTop: 4,
  },
  backgroundImageContainer: {
    elevation: 20,
    height: 180,
  },
  backgroundImage: {
    opacity: 0.7,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    borderBottomWidth: 2,
    borderColor: 'white',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerBtn: {
    height: 50,
    width: 50,
    backgroundColor: appTheme.COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingTag: {
    height: 30,
    width: 35,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonpic: {
    backgroundColor: 'white',
    borderRadius: 32,
    height: 40,
    width: 40,
  },
  buttonProfPic: {
    backgroundColor: 'white',
    borderRadius: 32,
    height: 35,
    width: 35,
    paddingLeft: 5,
    paddingTop: 5,
    marginLeft: '23%',
    marginTop: -30,
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  footer: {
    height: 70,
    backgroundColor: appTheme.COLORS.light,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bookNowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appTheme.COLORS.black,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  detailsContainer: { flex: 1, paddingHorizontal: 20, marginTop: 30 },
  facility: { flexDirection: 'row', marginRight: 15 },
  facilityText: { marginLeft: 5, color: appTheme.COLORS.gray },
});

export default Edit;
