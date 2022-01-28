import * as React from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  Alert,
  Collapse,
  NativeBaseProvider,
  CloseIcon,
  IconButton,
  Icon,
} from 'native-base';

import { View, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { images } from '../constants';
import * as SecureStore from 'expo-secure-store';

const SignIn = ({ navigation }) => {
  const [show, setShow] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [formData, setData] = React.useState({});
  const [token, setToken] = React.useState(false);
  const [errors, setErrors] = React.useState('');

  const handleClick = () => setShow(!show);

  useEffect(() => {
    /**
     * Represents a book.
     * @key
     */
    async function getValueFor(key) {
      const result = await SecureStore.getItemAsync(key);
      if (result) {
        setToken(true);
        navigation.navigate('Profile', {});
      } else {
        setToken(false);
      }
    }
    getValueFor('token');
  }, []);

  // eslint-disable-next-line require-jsdoc
  function advice(error) {
    if (error) {
      return (
        <Collapse isOpen={show2}>
          <Alert w="100%" status="error">
            <VStack space={1} flexShrink={1} w="100%">
              <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text
                    fontSize="sm"
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
                  onPress={() => setShow2(false)}
                />
              </HStack>
            </VStack>
          </Alert>
        </Collapse>
      );
    } else return null;
  }

  const onSubmit = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/login/`, requestOptions)
      .then(async response => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.non_field_errors) || (data && data.email) || response.status;
          setErrors(error[0]);
          setShow2(true);
        } else {
          await SecureStore.setItemAsync('token', data.token);
          navigation.push('Profile', { token: data.token });
        }
      })
      .catch(error => {
        console.error('There was an error!', error);
      });

  };

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <View style={styles.brandView}>
            <Image source={images.logo} style={{ height: 125, width: 125 }} />
          </View>
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: 'warmGray.50',
            }}
          >
            Welcome
          </Heading>
          <Heading
            mt="1"
            _dark={{
              color: 'warmGray.200',
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs"
          >
            Sign in to continue!
          </Heading>

          <VStack space={3} mt="5">

            {/* EMAIL FORM */}
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Email</FormControl.Label>
              <Input
                placeholder="Email"
                onChangeText={value => setData({ ...formData, email: value })}
              />
            </FormControl>

            {/* PASSWORD FORM */}
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Password</FormControl.Label>
              <Input
                type="password"
                placeholder="Password"
                secureTextEntry={!show}
                onChangeText={value => setData({ ...formData, password: value })}
                InputRightElement={
                  <IconButton
                    icon={
                      show ? (
                        <Icon as={MaterialIcons} name="visibility-off" size={6} />
                      ) : (
                        <Icon as={MaterialIcons} name="visibility" size={6} />
                      )
                    }
                    onPress={handleClick}
                  ></IconButton>
                }
              ></Input>
              <Link
                _text={{
                  fontSize: 'xs',
                  fontWeight: '500',
                  color: 'warning.700',
                }}
                alignSelf="flex-end"
                mt="1"
                onPress={() => {
                  navigation.navigate('ForgotPass', {});
                }}
              >
                Forget Password?
              </Link>
            </FormControl>
            {advice(errors)}
            <Button onPress={onSubmit} mt="2" colorScheme="warning">
              Sign in
            </Button>
            <HStack mt="6" justifyContent="center">
              <Text
                fontSize="sm"
                color="coolGray.600"
                _dark={{
                  color: 'warmGray.200',
                }}
              >
                I am a new user.{' '}
              </Text>
              <Link
                onPress={() => {
                  navigation.navigate('SignUp', {});
                }}
                _text={{
                  color: 'warning.700',
                  fontWeight: 'medium',
                  fontSize: 'sm',
                }}
              >
                Sign Up
              </Link>
            </HStack>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  brandView: {
    flex: 1,
    marginBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/**
 * Adds two numbers together.
 * @return {int} The sum of the two numbers.
 */
export default SignIn;
