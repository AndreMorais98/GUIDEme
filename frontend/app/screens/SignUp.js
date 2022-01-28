import * as React from 'react';
import { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  Box,
  Text,
  Modal,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  IconButton,
  ScrollView,
  Checkbox,
  WarningOutlineIcon,
  Icon,
} from 'native-base';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { images } from '../constants';
import PhoneInput from 'react-native-phone-number-input';

const SignUp = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [items, setItems] = useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ]);
  const [show, setShow] = React.useState(false);
  const [formData, setData] = React.useState({});
  const [errorsPass, setErrorsPass] = React.useState('');
  const [errorsEmail, setErrorsEmail] = React.useState('');
  const [errorsfirst_name, seterrorsfirst_name] = React.useState('');
  const [errorslast_name, seterrorslast_name] = React.useState('');
  const [errorsPhone, setErrorsPhone] = React.useState('');
  const [errorsCountry, setErrorsCountry] = React.useState('');
  const [errorsdistricts, setErrorsdistricts] = React.useState('');
  const [cvalue, setCValue] = useState(null);
  const [district, setdistrict] = useState(null);
  const [phoneInputt, setPhoneInputt] = useState(null);
  const [country, setCountry] = React.useState([]);
  const [districts, setdistricts] = React.useState([]);
  const [bul, setBul] = React.useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const phoneInput = useRef(null);
  const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

  const onCountryOpen = useCallback(() => {
    setDistrictOpen(false);
  }, []);

  const onDistrictOpen = useCallback(() => {
    setCountryOpen(false);
  }, []);

  /**
   * @description - This function is used to register the user
   * @return {void}
   */
  function registar() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        country: formData.country,
        district: formData.district,
        description: '',
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      }),
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.push('SignIn');
        } else {
          response
            .json()
            .then(responseJson => {
              if (responseJson.email) {
                setErrorsEmail(responseJson.email[0]);
              } else if (responseJson.password) {
                setErrorsPass(responseJson.password[0]);
              } else if (responseJson.phone) {
                setErrorsPhone(responseJson.phone[0]);
              } else if (responseJson.first_name) {
                seterrorsfirst_name(responseJson.first_name[0]);
              } else if (responseJson.last_name) {
                seterrorslast_name(responseJson.last_name[0]);
              } else if (responseJson.country) {
                setErrorsCountry(responseJson.country[0]);
              } else if (responseJson.district) {
                setErrorsPass(responseJson.district[0]);
              }
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

  const getdistricts = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: cvalue,
        }),
      });
      const json = await response.json();
      const c = json.data.map(district => {
        return { label: district, value: district };
      });
      setdistricts(c);
    } catch (error) {
      console.error(error);
    }
  };

  const getCountries = async () => {
    try {
      const response = await fetch(
        'https://countriesnow.space/api/v0.1/countries/info?returns=name'
      );
      const json = await response.json();
      const c = json.data.map(country => {
        return { label: country.name, value: country.name };
      });
      setCountry(c.sort((a, b) => a.value.localeCompare(b.value)));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (cvalue != undefined) {
      getdistricts();
    }
  }, [cvalue]);

  useEffect(() => {
    getCountries();
  }, []);

  const handleClick = () => setShow(!show);

  const onSubmit = () => {

    const first_name = validatefirst_name();
    const last_name = validatelast_name();
    const email = validateEmail();
    const pass = validatePassword();
    const number = validateNumber();
    const pais = validateCountry();
    const distrito = validatedistricts();
    last_name && first_name && email && pass && number && pais && distrito && bul
      ? registar()
      : console.log(
          bul,
          errorsPass,
          errorsEmail,
          errorsfirst_name,
          errorslast_name,
          errorsPhone,
          errorsCountry,
          errorsdistricts
        );
  };

  const validatePassword = () => {
    if (formData.password === undefined) {
      setErrorsPass('Invalid Password');
      return false;
    } else if (formData.password.length < 8) {
      setErrorsPass('Invalid Password');
      return false;
    }
    setErrorsPass('');
    return true;
  };

  const validateNumber = () => {
    if (formData.phone === undefined) {
      setErrorsPhone('Invalid Number');
      return false;
    } else if (!phoneInputt.current?.isValidNumber(formData.phone)) {
      setErrorsPhone('Invalid Number');
      return false;
    }
    setErrorsPhone('');
    return true;
  };

  const validateEmail = () => {
    if (formData.email === undefined) {
      setErrorsEmail('Invalid Email');
      return false;
    } else if (!formData.email.includes('@')) {
      setErrorsEmail('Invalid Email');
      return false;
    }
    setErrorsEmail('');
    return true;
  };

  const validatelast_name = () => {
    if (formData.last_name === undefined) {
      seterrorslast_name('Invalid Last Name');
      return false;
    } else {
      seterrorslast_name('');
      return true;
    }
  };

  const validatefirst_name = () => {
    if (formData.first_name === undefined) {
      seterrorsfirst_name('Invalid First Name');
      return false;
    } else {
      seterrorsfirst_name('');
      return true;
    }
  };

  const validateCountry = () => {
    if (formData.country === undefined) {
      setErrorsCountry('Invalid Country');
      return false;
    } else {
      setErrorsCountry('');
      return true;
    }
  };

  const validatedistricts = () => {
    if (formData.district === undefined) {
      setErrorsdistricts('Invalid districts');
      return false;
    } else {
      setErrorsdistricts('');
      return true;
    }
  };

  return (
    <NativeBaseProvider>
      <ScrollView nestedScrollEnabled={true}>
        <Center flex={1} px="3">
          <Box safeArea p="2" py="8" w="90%" maxW="290">
            <View style={styles.brandView}>
              <Image source={images.logo} style={{ height: 125, width: 125 }} />
            </View>
            <Heading
              style={{ marginTop: -70 }}
              size="lg"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: 'warmGray.50',
              }}
            >
              Sign Up
            </Heading>
            <VStack space={3} mt="5">
              {/* FORM FIRST NAME*/}
              <FormControl isRequired isInvalid={errorsfirst_name != ''}>
                <FormControl.Label _text={{ bold: true }}>First Name</FormControl.Label>
                <Input
                  placeholder="First Name"
                  onChangeText={value => setData({ ...formData, first_name: value })}
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
                >
                  {errorsfirst_name}
                </FormControl.ErrorMessage>
              </FormControl>
              {/* FORM LAST NAME*/}
              <FormControl isRequired isInvalid={errorslast_name != ''}>
                <FormControl.Label _text={{ bold: true }}>Last Name</FormControl.Label>
                <Input
                  placeholder="Last Name"
                  onChangeText={value => setData({ ...formData, last_name: value })}
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
                >
                  {errorslast_name}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* FORM EMAIL */}
              <FormControl isRequired isInvalid={errorsEmail != ''}>
                <FormControl.Label _text={{ bold: true }}>Email</FormControl.Label>
                <Input
                  placeholder="Email"
                  onChangeText={value => setData({ ...formData, email: value })}
                />
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                  _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
                >
                  {errorsEmail}
                </FormControl.ErrorMessage>
              </FormControl>

              {/* FORM PASSWORD */}
              <FormControl isRequired isInvalid={errorsPass != ''}>
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
                {errorsPass != '' ? (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
                  >
                    {errorsPass}
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText _text={{ fontSize: 'xs' }}>
                    {' '}
                    Password must contain atleast 8 characters{' '}
                  </FormControl.HelperText>
                )}
              </FormControl>

              {/* FORM COUNTRY*/}
              <FormControl isRequired isInvalid={errorsCountry != ''}>
                <FormControl.Label _text={{ bold: true }}>Country</FormControl.Label>

                <DropDownPicker
                  zIndex={1000}
                  open={countryOpen}
                  onOpen={onCountryOpen}
                  placeholderStyle={{
                    backgroundColor: '#F2F3F3',
                    color: '#a3a3a3',
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: '#F2F3F3',
                  }}
                  style={{
                    backgroundColor: '#F2F3F3',
                    borderColor: '#EAE9EA',
                  }}
                  nestedScrollEnabled={true}
                  listMode="FLATLIST"
                  open={open}
                  flatListProps={{
                    nestedScrollEnabled: true,
                  }}
                  scrollViewListProps={{
                    nestedScrollEnabled: true,
                  }}
                  onChangeValue={value => setData({ ...formData, country: value })}
                  placeholder="Select a Country"
                  searchable={true}
                  value={cvalue}
                  items={country}
                  setOpen={setOpen}
                  setValue={setCValue}
                  setItems={setItems}
                />

                {errorsCountry != '' ? (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
                  >
                    Need to choose a Country
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText _text={{ fontSize: 'xs' }}> </FormControl.HelperText>
                )}
              </FormControl>

              {/* FORM REGION*/}
              <FormControl isRequired isInvalid={errorsdistricts != ''}>
                <FormControl.Label _text={{ bold: true }}>Region</FormControl.Label>

                <DropDownPicker
                  zIndex={10}
                  open={districtOpen}
                  onOpen={onDistrictOpen}
                  placeholderStyle={{
                    backgroundColor: '#F2F3F3',
                    color: '#a3a3a3',
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: '#F2F3F3',
                  }}
                  style={{
                    backgroundColor: '#F2F3F3',
                    borderColor: '#EAE9EA',
                  }}
                  nestedScrollEnabled={true}
                  listMode="FLATLIST"
                  open={open1}
                  flatListProps={{
                    nestedScrollEnabled: true,
                  }}
                  scrollViewListProps={{
                    nestedScrollEnabled: true,
                  }}
                  onChangeValue={value => setData({ ...formData, district: value })}
                  placeholder="Select a Region"
                  searchable={true}
                  value={district}
                  items={districts}
                  setOpen={setOpen1}
                  setValue={setdistrict}
                  setItems={setItems}
                />

                {errorsdistricts != '' ? (
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                    _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }}
                  >
                    Need to choose a Region
                  </FormControl.ErrorMessage>
                ) : (
                  <FormControl.HelperText _text={{ fontSize: 'xs' }}> </FormControl.HelperText>
                )}
              </FormControl>

              {/* FORM PHONE NUMBER */}
              <FormControl isRequired isInvalid={errorsPhone != ''}>
                <FormControl.Label _text={{ bold: true }}>Phone Number</FormControl.Label>
                <PhoneInput
                  ref={phoneInput}
                  defaultCode="PT"
                  layout="first"
                  onChangeText={value => {
                    setData({
                      ...formData,
                      phone: '+' + phoneInput.current.state.code + value,
                    });
                    setPhoneInputt(phoneInput);
                  }}
                  withDarkTheme
                  autoFocus
                  containerStyle={{
                    width: (70 * viewportWidth) / 100,
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
              <FormControl isRequired>
                <Checkbox
                  value="Terms"
                  my="2"
                  size="sm"
                  isChecked={bul}
                  onChange={() => setBul(!bul)}
                >
                  <Text style={{ marginLeft: 5 }}>I read and accept the </Text>
                  <Link
                    _text={{
                      color: 'warning.700',
                      fontWeight: 'light',
                      fontSize: 'sm',
                    }}
                    onPress={() => setShowModal(true)}
                  >
                    Terms and Conditions
                  </Link>
                  <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    _backdrop={{
                      _dark: {
                        bg: 'coolGray.800',
                      },
                      bg: 'warmGray.50',
                    }}
                  >
                    <Modal.Content maxWidth="80%">
                      <Modal.CloseButton />
                      <Modal.Header>Terms and Conditions</Modal.Header>
                      <Modal.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec
                        tellus vel mi efficitur consectetur. Quisque ullamcorper neque diam, sed
                        cursus nibh facilisis ut. Pellentesque rutrum augue vitae suscipit
                        hendrerit. Aenean sit amet vestibulum libero, sit amet tristique nisi. Donec
                        ultrices dui eu venenatis rhoncus. Morbi vel lectus at arcu fermentum
                        fringilla. Ut purus sem, congue at sapien non, tristique iaculis tortor.
                        Integer odio nibh, aliquam sed venenatis cursus, scelerisque ut lectus.
                        Donec tempor sollicitudin orci ut convallis. Pellentesque habitant morbi
                        tristique senectus et netus et malesuada fames ac turpis egestas. Sed a leo
                        luctus dolor fermentum porta ac sollicitudin sapien. Nulla interdum lobortis
                        augue, in ornare urna rutrum quis. Nullam eget tempor dolor. Sed non erat id
                        enim rhoncus rutrum in sit amet sapien. Nulla faucibus nulla id turpis
                        ullamcorper, eget dapibus ligula ultricies. Vestibulum ante ipsum primis in
                        faucibus orci luctus et ultrices posuere cubilia curae; Etiam vulputate
                        consectetur pharetra. Integer a suscipit eros. Pellentesque cursus fermentum
                        dui. Quisque leo sem, venenatis sed posuere sagittis, sodales vitae nulla.
                        Curabitur condimentum lacus metus, eget commodo ante semper et. In euismod
                        tristique lacinia. Maecenas leo nisl, molestie vulputate erat quis, porta
                        sollicitudin libero. Aenean interdum ex at egestas aliquam. Morbi non dui
                        nulla. Ut tristique eros sit amet nisl congue, vel laoreet augue vehicula.
                        Phasellus iaculis porta magna, vel faucibus erat fringilla in. Pellentesque
                        ut elit diam. Duis ornare lectus at laoreet mollis. In non est ac nibh
                        ultrices tempor ac id leo. Duis consectetur metus sed pharetra euismod. Sed
                        mollis velit placerat ullamcorper rhoncus. Proin sollicitudin, dui sit amet
                        ornare cursus, leo odio aliquet elit, eu tempus orci ligula vitae lorem.
                        Donec nisi diam, fermentum dictum vehicula ut, malesuada quis ligula. Proin
                        molestie tempor libero, quis euismod eros dapibus ac. Pellentesque et tellus
                        non eros pellentesque dignissim quis quis lectus. Duis leo lorem, tempor
                        vitae sem a, vehicula egestas erat. Curabitur placerat egestas ante eget
                        auctor. Fusce non finibus orci, vel commodo mi. Suspendisse sapien mauris,
                        fringilla eget enim nec, commodo accumsan metus. Curabitur a cursus nibh.
                        Pellentesque lacinia vestibulum metus, sed congue mi sodales non. Fusce
                        molestie et nunc in vehicula. Nullam ultrices quam a metus gravida porttitor
                        a sit amet lectus. Vivamus porta nulla sed libero malesuada rhoncus. Nam
                        dapibus molestie tortor ac euismod. Sed lacinia, nibh id sagittis suscipit,
                        elit urna suscipit diam, non euismod metus ex vel erat. Nulla scelerisque
                        mattis est sed consectetur. Lorem ipsum dolor sit amet, consectetur
                        adipiscing elit. Sed molestie libero a neque malesuada, pulvinar tempor
                        tellus facilisis. Praesent eros magna, vulputate eget elit nec, ornare
                        volutpat urna. Duis vel nibh iaculis, malesuada dui ut, rutrum metus.
                        Integer ultrices libero leo, et dapibus tortor ullamcorper nec. Etiam justo
                        lorem, scelerisque id augue a, vehicula pharetra urna. Donec nisl mi,
                        sodales vitae dolor id, cursus vulputate libero. Quisque elementum suscipit
                        enim. Mauris iaculis imperdiet libero, quis fermentum nibh venenatis ac.
                        Vivamus blandit diam odio, sollicitudin semper ipsum consectetur ac. Donec
                        vel ullamcorper quam. Donec volutpat imperdiet dapibus. Proin mollis feugiat
                        semper. Suspendisse ornare leo mi, blandit ultricies sapien rhoncus et. Duis
                        id lectus in sapien accumsan mattis nec quis massa. In consequat, nisi eu
                        consequat auctor, quam mauris fermentum neque, commodo mollis felis neque et
                        lectus. Sed lacinia sed ligula non vehicula. In quis mi vitae justo posuere
                        consequat. Integer ultricies blandit fringilla. Vivamus at risus nec dolor
                        porttitor posuere in ut ex.
                      </Modal.Body>
                    </Modal.Content>
                  </Modal>
                </Checkbox>
              </FormControl>
              <Button onPress={onSubmit} mt="2" colorScheme="warning">
                Sign up
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}
                >
                  I already have an account.{' '}
                </Text>
                <Link
                  _text={{
                    color: 'warning.700',
                    fontWeight: 'medium',
                    fontSize: 'sm',
                  }}
                  onPress={() => {
                    navigation.navigate('SignIn', {});
                  }}
                >
                  Take me back
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </ScrollView>
    </NativeBaseProvider>
  );
};

SignUp.propTypes = {
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
export default SignUp;
