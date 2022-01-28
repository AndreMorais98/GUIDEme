import React, { useState } from 'react';
import {
  NativeBaseProvider,
  View,
  Box,
  StatusBar,
  Image,
  Text,
  Alert,
  Button,
  Center,
  Collapse,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from 'native-base';

import { StyleSheet } from 'react-native';
import { images } from '../constants';
import PropTypes from 'prop-types';

const Receipt = ({ navigation, route }) => {
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const price = route.params?.price || 24.90;
  const token  = route.params.token;
  const subPlanSlug = route.params?.subPlanSlug;
  const expPk = route.params?.expPk;
  const expDate = route.params?.expDate;
  const expTime = route.params?.expTime;

  function bookExperience() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
      body: JSON.stringify({
        date: expDate,
        time: expTime,
      }),
    }
    fetch(`https://guideme-api.herokuapp.com/api/experiences/${expPk}/book/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          navigation.push('Profile', { token: token });
        }
        else {
          const data = await response.json();
          setError(data.non_field_errors[0]);
          setShowModal(true)
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  function advice(error) {
    if (error) {
      return (
        <Collapse isOpen={showModal}>
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
                  onPress={() => setShowModal(false)}
                />
              </HStack>
            </VStack>
          </Alert>
        </Collapse>
      );
    } else return null;
  }

  function purchasePlan() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    }
    fetch(`https://guideme-api.herokuapp.com/api/subscriptions/subscribe/${subPlanSlug}/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.push('Profile', { token: token });
        }
        else {
          console.log(response.status);
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
   * @memberof Receipt
   */
  function renderAppBar() {
    return (
      <>
        <StatusBar backgroundColor="#c2410c" barStyle="light-content" />

        <Box safeAreaTop />
      </>
    );
  }

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof Receipt
   */
  function renderWindow() {
    return (
      <View marginBottom="30%" backgroundColor="white">
        <VStack space={4}>
        <View style={{alignItems:'center'}}>
            <Image source={images.check} alt='check' style={{height: 50, width: 50}} />
        </View>
        <Text bold fontSize="xl" textAlign="center" >THANK YOU FOR YOUR PURCHASE!</Text>
        <Text fontSize="sm" textAlign="center" marginBottom="5"> You will receive an email with all the information about your experience.</Text>
        <HStack paddingBottom="10" space={10} alignItems="center" display="flex" justifyContent="center">
            <View>
                <Image source={images.multibanco} alt='multibanco' style={{height: 50, width: 140}} />
            </View>
            <VStack>
                <HStack>
                    <Text bold> Entidade: </Text>
                    <Text> 24133 </Text>
                </HStack>
                <HStack>
                    <Text bold> Referência: </Text>
                    <Text> 854201236 </Text>
                </HStack>
                <HStack>
                    <Text bold> Montante: </Text>
                    <Text> {price} </Text>
                </HStack>
            </VStack>
        </HStack>
        <Text fontSize="sm" textAlign="center" marginBottom="5"> This reference has a duration of 4 hours.</Text>
        <View alignItems="center" display="flex" alignContent="center">
          <HStack space={10}>
          <Button
              size="md"
              variant={'solid'}
              colorScheme="orange"
              onPress={() => {subPlanSlug ? purchasePlan() : bookExperience()}}
              _text={{ color: 'white' }}
            >
              Continue
          </Button>
          <Button
              size="md"
              variant={'solid'}
              colorScheme="orange"
              onPress={() => {
                navigation.goBack();
              }}
              _text={{ color: 'white' }}
            >
              Cancel
          </Button>
          </HStack>
        </View>
        {advice(error)}
        </VStack>
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="white" safeAreaTop>
        {renderAppBar()}
        <Center flex={1}>{renderWindow()}</Center>
      </Box>
    </NativeBaseProvider>
  );
};

Receipt.propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
    route: PropTypes.object.isRequired,
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
});

export default Receipt;
