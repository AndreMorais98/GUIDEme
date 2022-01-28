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
  FormControl,
  Alert,
  Collapse,
  CloseIcon,
  VStack,
} from 'native-base';

import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const EditPass = ({ navigation, route }) => {
  const [show, setShow] = React.useState(false);
  const [show1, setShow1] = React.useState(false);
  const [show2, setShow2] = React.useState(false);
  const [formData, setData] = React.useState({});
  const [errors, setErrors] = React.useState('');
  const [show3, setShow3] = React.useState(true);

  const { token } = route.params;

  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);
  const handleClick2 = () => setShow2(!show2);

  function advice(error) {
    if (error) {
      return (
        <Collapse isOpen={show3}>
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
                  onPress={() => setShow3(false)}
                />
              </HStack>
            </VStack>
          </Alert>
        </Collapse>
      );
    } else return null;
  }

  function changePass() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
      body: JSON.stringify({
        old_password: formData.oldpass,
        new_password: formData.newpass,
        new_password_confirmation: formData.newpassconf,
      }),
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/password_change/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.push('Edit', { token: token });
        } else {
          response
            .json()
            .then(responseJson => {
              setErrors(responseJson.non_field_errors[0]);
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
                    navigation.navigate('Edit', { token: token });
                  }}
                />
              }
            />
          </HStack>
          <HStack space="4" alignItems="center">
            <Text color="black" paddingRight="29%" fontSize="20" fontWeight="bold">
              Edit your password
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
  function renderWindow() {
    return (
      <View width="70%">
        <VStack space={4}>
          <FormControl>
            <FormControl.Label _text={{ bold: true }}>Old Password</FormControl.Label>
            <Input
              type="password"
              secureTextEntry={!show}
              onChangeText={value => setData({ ...formData, oldpass: value })}
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
          </FormControl>

          <FormControl>
            <FormControl.Label _text={{ bold: true }}>New Password</FormControl.Label>
            <Input
              type="password"
              secureTextEntry={!show1}
              onChangeText={value => setData({ ...formData, newpass: value })}
              InputRightElement={
                <IconButton
                  icon={
                    show1 ? (
                      <Icon as={MaterialIcons} name="visibility-off" size={6} />
                    ) : (
                      <Icon as={MaterialIcons} name="visibility" size={6} />
                    )
                  }
                  onPress={handleClick1}
                ></IconButton>
              }
            ></Input>
          </FormControl>

          <FormControl>
            <FormControl.Label _text={{ bold: true }}>Confirm New Password</FormControl.Label>
            <Input
              type="password"
              secureTextEntry={!show2}
              onChangeText={value => setData({ ...formData, newpassconf: value })}
              InputRightElement={
                <IconButton
                  icon={
                    show2 ? (
                      <Icon as={MaterialIcons} name="visibility-off" size={6} />
                    ) : (
                      <Icon as={MaterialIcons} name="visibility" size={6} />
                    )
                  }
                  onPress={handleClick2}
                ></IconButton>
              }
            ></Input>
          </FormControl>

          {advice(errors)}

          <Button
            size="md"
            variant={'solid'}
            colorScheme="orange"
            onPress={() => {
              changePass();
            }}
            _text={{ color: 'white' }}
          >
            Save
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

export default EditPass;
