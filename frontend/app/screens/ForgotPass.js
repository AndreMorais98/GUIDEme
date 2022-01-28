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
  Input,
  VStack,
} from 'native-base';

import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ForgotPass = ({ navigation }) => {
  /**
   * @description - This function is used to render the tab bar
   * @param {object} props - props
   * @return {JSX} JSX
   * @memberof ForgotPass
   */

  const [formData, setData] = React.useState({});

  function changePass() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
      }),
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/password_reset/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.navigate('SignIn');
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
  }

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
                    navigation.navigate('SignIn', {});
                  }}
                />
              }
            />
          </HStack>
          <HStack space="4" alignItems="center">
            <Text color="black" paddingRight="29%" fontSize="20" fontWeight="bold">
              Forgot your password?
            </Text>
          </HStack>
        </HStack>
      </>
    );
  }

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof ForgotPass
   */
  function renderWindow() {
    return (
      <View width="70%" marginBottom="40%">
        <VStack space={4}>
          <IconButton
            style={{ alignItems: 'center' }}
            icon={<Icon as={<MaterialIcons name="lock" />} size="md" color="black" />}
          />
          <Text style={{ color: '#AEAEAE' }}>
            Insert your email and we are going to send you a link to recover your account{' '}
          </Text>
          <Input
            onChangeText={value => setData({ ...formData, email: value })}
            placeholder="Your email"
          />
          <Button
            size="md"
            variant={'solid'}
            colorScheme="orange"
            onPress={() => {
              changePass();
            }}
            _text={{ color: 'white' }}
          >
            Send
          </Button>
        </VStack>
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#f5f5f5" safeAreaTop>
        {renderAppBar()}
        <Center flex={1}>{renderWindow()}</Center>
      </Box>
    </NativeBaseProvider>
  );
};

const style = StyleSheet.create({
  boxText: {
    width: '90%',
    height: '90%',
    borderWidth: 1,
    borderColor: '#a3a3a3',
    backgroundColor: '#e5e5e5',
    borderBottomStartRadius: 50,
    borderBottomEndRadius: 50,
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

export default ForgotPass;
