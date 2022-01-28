import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import * as SecureStore from 'expo-secure-store';

const LandingPage = ({ navigation }) => {
  useEffect(() => {
    /**
     * Represents a book.
     * @key
     */
    async function getValueFor(key) {
      const result = await SecureStore.getItemAsync(key);
      if (result) {
        navigation.replace('Profile', { token: result });
      } else {
        navigation.replace('SignIn');
      }
    }
    getValueFor('token');
  }, []);

  return null;
};

LandingPage.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
export default LandingPage;
