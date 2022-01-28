import React from 'react';
import {
  NativeBaseProvider,
  Box,
  View,
  HStack,
  Center,
  StatusBar,
  IconButton,
  Icon,
  Text,
  Button,
  Alert,
} from 'native-base';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { useState, useRef } from 'react';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import appTheme from '../constants/theme';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config';
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';

const LocationScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [location, setLocation] = useState('Search');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const mapRef = useRef();
  /**
   * @description - This function is used to render the tab bar
   * @param {object} props - props
   * @return {JSX} JSX
   * @memberof EditPass
   */
  function renderAppBar() {
    return (
      <>
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
                    navigation.navigate('HomeScreen', { token: token });
                  }}
                />
              }
            />
          </HStack>
          <HStack space="4" alignItems="center">
            <Text color="black" paddingRight="29%" fontSize="20" fontWeight="bold">
              Select your location
            </Text>
          </HStack>
        </HStack>
      </>
    );
  }
  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof EditPass
   */
  async function askPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    setLoading(true);
    const loca = await Location.getCurrentPositionAsync({});
    const locc = loca;

    await geoCoding(locc.coords.latitude, locc.coords.longitude);
    setLoading(false);
  }

  const geoCoding = async (lat, long) => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
          long +
          ',' +
          lat +
          '.json?access_token=' +
          config.MAPBOX_API_KEY
      );
      const json = await response.json();
      const filtered = json.features[0].context.filter(x => x.id.includes('place'));
      if (filtered.length == 1) {
        const location = filtered[0].text;
        setLocation(location);
        mapRef.current?.setAddressText(location);
        setError(false);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error(error);
    }
  };

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof EditPass
   */
  function renderDirectLocation() {
    return (
      <View style={styles.header}>
        <Box>
          <Button
            isLoading={loading}
            backgroundColor="#fff"
            _text={{
              color: appTheme.COLORS.gray,
              fontSize: 'md',
            }}
            leftIcon={<Icon as={<FontAwesome name="location-arrow" />} size="sm" color="black" />}
            onPress={() => {
              askPermissions();
            }}
          >
            Current Location
          </Button>
        </Box>
      </View>
    );
  }

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof EditPass
   */
  function renderSearch() {
    return (
      <GooglePlacesAutocomplete
        placeholder="Search"
        ref={mapRef}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true

          setLocation(data.description);
        }}
        query={{
          key: config.GOOGLE_MAPS_API_KEY,
          language: 'en',
        }}
      />
    );
  }

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof EditPass
   */
  function renderWindow() {
    return (
      <Button
        size="md"
        variant={'solid'}
        colorScheme="orange"
        onPress={() => {
          if (location != 'Search') {
            SecureStore.setItemAsync('location', location);
          }
          navigation.push('HomeScreen', { token: token });
        }}
        _text={{ color: 'white' }}
      >
        Save
      </Button>
    );
  }

  const renderError = error => {
    if (error.error) {
      return (
        <Alert w="100%" status="error">
          <Alert.Icon mt="1" />
          <Text fontSize="md" color="coolGray.800">
            Failed to detect location
          </Text>
        </Alert>
      );
    } else {
      return null;
    }
  };

  return (
    <NativeBaseProvider>
      {renderAppBar()}
      <Box flex={1} bg="#f5f5f5" safeAreaTop>
        {renderDirectLocation()}
        {renderSearch()}
        {renderError({ error })}

        <Center flex={1}>{renderWindow()}</Center>
      </Box>
    </NativeBaseProvider>
  );
};

LocationScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  boxText: {
    width: '90%',
    height: '90%',
    borderWidth: 1,
    borderColor: '#a3a3a3',
    backgroundColor: '#e5e5e5',
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textinBox: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingTop: '2%',
    paddingBottom: '5%',
  },
  drawline: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#a3a3a3',
  },
});

export default LocationScreen;
