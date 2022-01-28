import React, { useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  View,
  HStack,
  StatusBar,
  IconButton,
  Button,
  Input,
  TextArea,
  FormControl,
  Text,
  VStack,
  Icon as NativeBaseIcon,
  extendTheme,
  ScrollView,
  Checkbox,
  Container,
  Icon,
  Modal,
  Switch,
} from 'native-base';

import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Tags from 'react-native-tags';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import config from '../config';
import { LocaleConfig } from 'react-native-calendars';
import PropTypes from 'prop-types';
import appTheme from '../constants/theme';
import { Footer } from '../components/footer';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import NumericInput from 'react-native-numeric-input';
import { LogBox } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('screen');
LogBox.ignoreLogs(['NativeBase:']);

LocaleConfig.defaultLocale = 'en';
const ExpForm = ({ navigation, route }) => {
  const { token, photos, isGuide } = route.params;
  const [name, setName] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [price, setPrice] = React.useState(0.0);
  const [part, setPart] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [groupValue, setGroupValue] = React.useState([]);
  const [groupValue2, setGroupValue2] = React.useState([]);
  const [groupValue3, setGroupValue3] = React.useState([]);
  const [groupValue4, setGroupValue4] = React.useState([]);
  const [groupValue5, setGroupValue5] = React.useState([]);
  const [groupValue6, setGroupValue6] = React.useState([]);
  const [groupValue7, setGroupValue7] = React.useState([]);
  const [borderColor, setBorderColor] = React.useState('#EAE9EA');
  const [keywords, setKeywords] = React.useState([]);
  const [checked, setChecked] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [showModal6, setShowModal6] = useState(false);
  const [showModal7, setShowModal7] = useState(false);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
  const checkArr = [];
  for (let i = 0; i < 24; i++) {
    checkArr.push({
      id: i,
      text: i + ':00',
    });
  }

  const parseSchedule = () => {
    let res = groupValue.map(x => ({ week_day: 0, time: x + ':00' }));
    res = res.concat(groupValue2.map(x => ({ week_day: 1, time: x + ':00' })));
    res = res.concat(groupValue3.map(x => ({ week_day: 2, time: x + ':00' })));
    res = res.concat(groupValue4.map(x => ({ week_day: 3, time: x + ':00' })));
    res = res.concat(groupValue5.map(x => ({ week_day: 4, time: x + ':00' })));
    res = res.concat(groupValue6.map(x => ({ week_day: 5, time: x + ':00' })));
    res = res.concat(groupValue7.map(x => ({ week_day: 6, time: x + ':00' })));
    return res;
  };

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof EditPass
   */
  function postExp(form) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
      body: JSON.stringify(form),
    };
    fetch(`https://guideme-api.herokuapp.com/api/experiences/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.push('HomeScreen', { token: token, isGuide: isGuide });
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
  const renderAppBar = () => {
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
              Create Experience
            </Text>
          </HStack>
        </HStack>
      </>
    );
  };
  const handleFocus = () => {
    setBorderColor('#ea580c');
  };
  const renderScrollView = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={style.detailsContainer}>
          <VStack space={3} mt="5" width="100%">
            {/* First Name */}
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Name</FormControl.Label>
              <Input
                onChangeText={value => setName(value)}
                variant="outline"
                placeholder="Experience Name"
                style={{ marginBottom: 15 }}
              />
            </FormControl>
            {/* Country */}
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Location</FormControl.Label>
              <View>
                <ScrollView
                  horizontal
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ flex: 1, width: '100%', height: '100%' }}
                >
                  <GooglePlacesAutocomplete
                    placeholder="Search"
                    blur={() => setBorderColor('#ea580c')}
                    isFocused={value => {
                      setBorderColor('#ea580c');
                    }}
                    textInputProps={{
                      onFocus: () => {
                        setBorderColor('#ea580c');
                      },
                      onBlur: () => {
                        setBorderColor('#EAE9EA');
                      },
                      autoCaptalize: 'none',
                      autoCorrect: false,
                    }}
                    styles={{
                      textInput: {
                        backgroundColor: appTheme.COLORS.light,
                      },
                      textInputContainer: {
                        borderWidth: 1,
                        borderRadius: 5,
                        borderColor: borderColor,
                      },
                    }}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      setLocation(data.description);
                    }}
                    query={{
                      key: config.GOOGLE_MAPS_API_KEY,
                      language: 'en',
                    }}
                  />
                </ScrollView>
              </View>
            </FormControl>
            {/* Description text box */}
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Description</FormControl.Label>
              <Box w="100%" style={{ marginBottom: 10 }}>
                <TextArea
                  onChangeText={value => setDesc(value)}
                  aria-label="t1"
                  numberOfLines={4}
                  placeholder="Experience Description"
                  _dark={{
                    placeholderTextColor: 'gray.300',
                  }}
                />
              </Box>
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Schedule</FormControl.Label>
              <HStack alignItems="center" space={4}>
                <Text>Periodic</Text>
                <Switch
                  size="sm"
                  colorScheme="orange"
                  isChecked={checked}
                  onToggle={value => {
                    setChecked(value);
                  }}
                />
                <Text>One day</Text>
              </HStack>
              {!checked ? (
                <View>
                  <View>
                    <Button marginBottom={4} onPress={showDatepicker}>
                      Select Start Date
                    </Button>
                  </View>

                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      minimumDate={new Date()}
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
              ) : null}
              {!checked ? (
                <HStack space={1} width={width} alignItems="center" flexDirection="row">
                  {!groupValue.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal(true)}>
                      Mon
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal(true)}>Mon</Button>
                  )}

                  <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              defaultValue={groupValue}
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                  {!groupValue2.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal2(true)}>
                      Tue
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal2(true)}>Tue</Button>
                  )}
                  <Modal isOpen={showModal2} onClose={() => setShowModal2(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue2(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal2(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal2(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                  {!groupValue3.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal3(true)}>
                      Wed
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal3(true)}>Wed</Button>
                  )}
                  <Modal isOpen={showModal3} onClose={() => setShowModal3(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue3(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal3(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal3(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                  {!groupValue4.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal4(true)}>
                      Tur
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal4(true)}>Tur</Button>
                  )}
                  <Modal isOpen={showModal4} onClose={() => setShowModal4(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue4(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal4(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal4(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                  {!groupValue5.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal5(true)}>
                      Fri
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal5(true)}>Fri</Button>
                  )}
                  <Modal isOpen={showModal5} onClose={() => setShowModal5(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue5(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal5(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal5(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                  {!groupValue6.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal6(true)}>
                      Sat
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal6(true)}>Sat</Button>
                  )}
                  <Modal isOpen={showModal6} onClose={() => setShowModal6(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue6(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal6(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal6(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                  {!groupValue7.length > 0 ? (
                    <Button variant="outline" onPress={() => setShowModal7(true)}>
                      Sun
                    </Button>
                  ) : (
                    <Button onPress={() => setShowModal7(true)}>Sun</Button>
                  )}
                  <Modal isOpen={showModal7} onClose={() => setShowModal7(false)}>
                    <Modal.Content maxWidth="400px">
                      <Modal.CloseButton />
                      <Modal.Header>Select hours</Modal.Header>
                      <Modal.Body>
                        <Container>
                          <FormControl>
                            <FormControl.Label
                              _text={{
                                fontSize: 'lg',
                                bold: true,
                              }}
                            >
                              Preferred hours
                            </FormControl.Label>
                            <Text fontSize="md">Selected Values: </Text>
                            <Checkbox.Group
                              mt="2"
                              colorScheme="green"
                              accessibilityLabel="choose multiple items"
                              onChange={values => {
                                setGroupValue7(values || []);
                              }}
                              alignItems="flex-start"
                            >
                              {checkArr.map(checkInfo => {
                                return (
                                  <Checkbox value={checkInfo.id} key={checkInfo.text}>
                                    {checkInfo.text}
                                  </Checkbox>
                                );
                              })}
                            </Checkbox.Group>
                          </FormControl>
                        </Container>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button.Group space={2}>
                          <Button
                            variant="ghost"
                            colorScheme="blueGray"
                            onPress={() => {
                              setShowModal7(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onPress={() => {
                              setShowModal7(false);
                            }}
                          >
                            Save
                          </Button>
                        </Button.Group>
                      </Modal.Footer>
                    </Modal.Content>
                  </Modal>
                </HStack>
              ) : (
                <View>
                  <View>
                    <Button marginBottom={4} onPress={showDatepicker}>
                      Select Date
                    </Button>
                  </View>
                  <View>
                    <Button onPress={showTimepicker}>Select Hour</Button>
                  </View>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      minimumDate={new Date()}
                      display="default"
                      onChange={onChange}
                    />
                  )}
                </View>
              )}
            </FormControl>
            {/* District */}
            {/* Last Name */}
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Number of people</FormControl.Label>
              <NumericInput
                totalWidth={240}
                totalHeight={50}
                iconSize={25}
                step={1}
                valueType="integer"
                rounded
                minValue={0}
                textColor="#ea580c"
                onChange={value => {
                  setPart(value);
                }}
                iconStyle={{ color: '#ea580c' }}
                type="up-down"
                upDownButtonsBackgroundColor={appTheme.COLORS.light}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Price (€)</FormControl.Label>
              <NumericInput
                totalWidth={240}
                onChange={value => {
                  setPrice(value);
                }}
                totalHeight={50}
                iconSize={25}
                step={0.1}
                valueType="real"
                minValue={0}
                rounded
                textColor="#ea580c"
                iconStyle={{ color: '#ea580c' }}
                type="up-down"
                upDownButtonsBackgroundColor={appTheme.COLORS.light}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Duration (hours)</FormControl.Label>
              <NumericInput
                totalWidth={240}
                onChange={value => {
                  setDuration(value);
                }}
                totalHeight={50}
                iconSize={25}
                step={1}
                valueType="integer"
                minValue={0}
                rounded
                textColor="#ea580c"
                iconStyle={{ color: '#ea580c' }}
                type="up-down"
                upDownButtonsBackgroundColor={appTheme.COLORS.light}
              />
            </FormControl>
            {/* Button to change Password */}
            <FormControl>
              <Button
                onPress={() => {
                  navigation.navigate('ImageScreen', { token: token, photos: [] });
                }}
                styles={{ marginTop: 20 }}
                leftIcon={<Icon as={Ionicons} name="cloud-upload-outline" size="sm" />}
              >
                Upload Images
              </Button>
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ bold: true }}>Keywords:</FormControl.Label>
              <Tags
                initialText=""
                textInputProps={{
                  placeholder: 'Add some tags...',
                  placeholderTextColor: appTheme.COLORS.gray,
                }}
                onChangeTags={tags => {
                  setKeywords(tags);
                }}
                containerStyle={{ justifyContent: 'center' }}
                inputStyle={{ backgroundColor: 'white' }}
                renderTag={({ tag, index, onPress, deleteTagOnPress, readonly }) => (
                  <TouchableOpacity style={style.tag} key={`${tag}-${index}`} onPress={onPress}>
                    <Text style={style.textTag}>{tag}</Text>
                  </TouchableOpacity>
                )}
              />
            </FormControl>
            {/* Botão para salvar definições */}
            <Button
              textAlign="center"
              variant="outline"
              style={{
                marginBottom: '4%',
              }}
              onPress={() => {
                const form = {
                  title: name,
                  description: desc,
                  images: photos,
                  price: price,
                  participants_limit: part,
                  duration: duration,
                  type: checked ? 1 : 2,
                  keywords: keywords.join(', '),
                  location: location,
                };
                if (!checked) {
                  form.schedule = parseSchedule();

                  form.start_date = date.toISOString().split('T')[0];
                } else {
                  form.date = date;
                }
                postExp(form);
              }}
            >
              Save
            </Button>
          </VStack>
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

          _text: {
            color: 'white',
          },
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
      },
      TextArea: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 'md',
        },
        defaultProps: {
          colorScheme: 'rgb(234, 88, 12)',
        },
      },
      Checkbox: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 'md',
        },
        defaultProps: {
          colorScheme: 'rgb(234, 88, 12)',
        },
      },
      Modal: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 'md',
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
        <Footer select="3" navigation={navigation} isGuide={isGuide} token={token} />
      </Box>
    </NativeBaseProvider>
  );
};

ExpForm.propTypes = {
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
  tag: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    padding: 3,
    margin: 3,
  },
  textTag: {
    color: appTheme.COLORS.white,
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
  searchContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    top: 20,
    zIndex: 100,
    elevation: 3,
    paddingHorizontal: 15,
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

export default ExpForm;
