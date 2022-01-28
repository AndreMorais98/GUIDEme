import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import config from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import appTheme from '../constants/theme';
import PropTypes from 'prop-types';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { Footer } from '../components/footer';
import {
  NativeBaseProvider,
  Box,
  IconButton,
  Text,
  Icon as IconM,
  extendTheme,
  VStack,
  HStack,
  Stack,
  Center,
  Input,
  Modal,
  FormControl,
  Button,
  StatusBar,
  Slider,
} from 'native-base';

import { Carrousel, GuideCarrousel } from '../components/carroussel';

import { getDistance } from 'geolib';
const { width } = Dimensions.get('screen');

const HomeScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const { token, isGuide } = route.params;
  const [experiencesLoaded, setExperiencesLoaded] = React.useState(false);
  const [guidesLoaded, setGuidesLoaded] = React.useState(false);
  const [rangeLoaded, setRangeLoaded] = React.useState(false);
  const [listExperiences, setListExperiences] = React.useState([]);
  const [nearbyListExperiences, setNearbyListExperiences] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [listGuides, setListGuides] = React.useState({});
  const [showModal, setShowModal] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1000);
  const [range, setRange] = useState(300);
  const [minR, setMinR] = useState(0);
  const [maxR, setMaxR] = useState(5);
  const [filters, setFilters] = useState(false);
  const [date, setDate] = useState(null);
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

  const getListExperiences = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/experiences/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          let data = await response.json();
          data = data.sort(function (a, b) {
            if (!a.premium && b.premium) {
              return 1;
            }
            if (a.premium && !b.premium) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          setListExperiences(data);

          setExperiencesLoaded(true);
          setRefreshing(false);
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

  const setMinPrice = () => {
    const minPrice = listExperiences.reduce(
      (min, p) => (p.price < min ? p.price : min),
      listExperiences.price
    );
    setMin(minPrice);
  };

  const setMaxPrice = () => {
    const maxPrice = listExperiences.reduce(
      (max, p) => (p.price > max ? p.price : max),
      listExperiences.price
    );
    setMax(maxPrice);
  };

  const getListGuides = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/guides/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          let data = await response.json();
          data = data.sort(function (a, b) {
            if (!a.premium && b.premium) {
              return 1;
            }
            if (a.premium && !b.premium) {
              return -1;
            }
            // a must be equal to b
            return 0;
          });

          setListGuides(data);
          setGuidesLoaded(true);
          setRefreshing(false);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getListExperiences();
    getListGuides();
  }, []);

  useEffect(() => {
    getListExperiences();
    getListGuides();
  }, []);

  useEffect(() => {
    handleNearbyRoutes(60);
  }, [listExperiences]);

  useEffect(() => {
    /**
     * Represents a book.
     * @key
     */
    async function getLocation() {
      const result = await SecureStore.getItemAsync('location');
      if (result) {
        setLocation(result);
      } else {
        setLocation('Amarante, Portugal');
      }
    }
    getLocation();
  }, []);

  const [query, setQuery] = useState('');
  const [filteredHouses, setFilteredHouses] = useState([]);

  const handleSearch = query => {
    setQuery(query);

    const filtered = listExperiences.filter(route => {
      // eslint-disable-next-line react/prop-types
      let keys = route.keywords.toLowerCase().split(',');
      keys = keys.map(function (el) {
        return el.trim();
      });

      return (
        route.title.toLowerCase().includes(query.toLowerCase()) ||
        keys.includes(query.toLowerCase())
      );
    });
    setFilteredHouses(filtered);
  };
  const handleFilters = async query => {
    setQuery(query);
    const fil = await handleNearbyRoutesFil(range * 100);
    const filtered = fil.filter(route => {
      // eslint-disable-next-line react/prop-types

      return (
        min <= route.price &&
        route.price <= max &&
        route.title.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredHouses(filtered);
  };

  const getGeoCoding = async loc => {
    try {
      const response = await fetch(
        'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
          loc +
          '.json?access_token=' +
          config.MAPBOX_API_KEY
      );
      const json = await response.json();
      return { latitude: json.features[0].center[1], longitude: json.features[0].center[0] };   
    } catch (error) {
      console.error(error);
    }
  };

  const handleNearbyRoutesFil = async (val, query) => {
    setQuery(query);
    getGeoCoding(location)
      .then(async data => {
        let res = listExperiences.map(async exp => {
          return {
            ...exp,
            coding: await getGeoCoding(exp.location),
          };
        });

        res = await Promise.all(res);
        res = res.filter(exp => getDistance(exp.coding, data) < val * 1000);
        res = res.filter(route => {
          // eslint-disable-next-line react/prop-types

          const routerat = route.rating ? route.rating : 0;

          return (
            min <= route.price &&
            route.price <= max &&
            routerat <= maxR &&
            routerat >= minR &&
            (checkDate(route) || checkSchedule(route)) &&
            route.keywords.contains() &&
            (route.title.toLowerCase().includes(query.toLowerCase()) ||
              route.keywords.split(',').toLowerCase().includes(query.toLowerCase()))
          );
        });

        setFilteredHouses(res);
      })
      .catch(error => console.log('ERRO', error));
  };

  const checkSchedule = route => {
    if (!date) {
      return true;
    }
    return (
      route?.schedule.includes((date.getDay() + 6) % 7) &&
      new Date(route?.start_date?.split('T')[0]) <= new Date(date.toISOString().split('T')[0])
    );
  };

  const checkDate = route => {
    if (!date) {
      return true;
    }

    return route?.date?.split('T')[0] == date.toISOString().split('T')[0];
  };
  const handleNearbyRoutes = async val => {
    getGeoCoding(location)
      .then(async data => {

        let res = await Promise.all(
          listExperiences.map(async exp => {
            return {
              ...exp,
              coding: await getGeoCoding(exp.location),
            };
          })
        );
        res = res.filter(exp => getDistance(exp.coding, data) < val * 1000);
        setNearbyListExperiences(res);
        setRangeLoaded(true);
        setRefreshing(false);
      })
      .catch(error => console.log('ERRO', error));
  };

  const renderFilters = () => {
    return (
      <Center>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Filters</Modal.Header>
            <Modal.Body>
              <Box alignItems="center" w="100%">
                <VStack space={4} w="75%" maxW="300">
                  <FormControl.Label>Set your budget</FormControl.Label>
                  <HStack>
                    <Input
                      onChangeText={value => {
                        setMin(value);
                      }}
                      mx="3"
                      placeholder="Min"
                      w="30%"
                      keyboardType="numeric"
                      maxWidth="300px"
                    />
                    <Text bold marginTop="2">
                      -
                    </Text>
                    <Input
                      mx="3"
                      placeholder="Max"
                      w="30%"
                      keyboardType="numeric"
                      maxWidth="300px"
                      onChangeText={value => setMax(value)}
                    />
                  </HStack>
                  <FormControl.Label>Set your range (km)</FormControl.Label>

                  <HStack space={4}>
                    <Text>{range}</Text>
                    <Slider
                      colorScheme="orange"
                      onChange={v => {
                        setRange(Math.floor(v));
                      }}
                      w="3/4"
                      maxW="300"
                      defaultValue={range}
                      minValue={0}
                      maxValue={300}
                      accessibilityLabel="hello world"
                      step={1}
                    >
                      <Slider.Track>
                        <Slider.FilledTrack />
                      </Slider.Track>
                      <Slider.Thumb />
                    </Slider>
                  </HStack>
                  <FormControl.Label>Set your Rating</FormControl.Label>
                  <HStack>
                    <Input
                      onChangeText={value => {
                        setMinR(value);
                      }}
                      keyboardType="numeric"
                      mx="3"
                      placeholder="Min"
                      w="30%"
                      maxWidth="300px"
                    />
                    <Text bold marginTop="2">
                      -
                    </Text>
                    <Input
                      mx="3"
                      keyboardType="numeric"
                      placeholder="Max"
                      w="30%"
                      maxWidth="300px"
                      onChangeText={value => setMaxR(value)}
                    />
                  </HStack>
                  <View>
                    <View>
                      <Button marginBottom={4} onPress={showDatepicker}>
                        Select Date
                      </Button>
                    </View>

                    {show && (
                      <DateTimePicker
                        testID="dateTimePicker"
                        minimumDate={new Date()}
                        value={date ? date : new Date()}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                      />
                    )}
                  </View>
                </VStack>
              </Box>
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
                    setFilters(true);
                    handleNearbyRoutesFil(range, query);
                    setShowModal(false);
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
    );
  };

  const renderScrollView = () => {
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
        >
          <View style={style.searchInputContainer}>
            <Icon name="search" size={25} color={appTheme.COLORS.gray}></Icon>
            <TextInput
              value={query}
              onChange={text => {
                handleSearch(text.nativeEvent.text);
              }}
              placeholder="Search route, location or tourist guide"
            ></TextInput>
          </View>

          <View space={1}>
            <View style={style.sortBtn}>
              <IconButton
                size="md"
                onPress={() => setShowModal(true)}
                color={appTheme.COLORS.white}
                _icon={{
                  color: 'white',
                  as: MaterialIcons,
                  name: 'tune',
                }}
              />
            </View>
          </View>
        </View>

        {query.length == 0 && !filters ? (
          <View style={{ marginLeft: '3%' }}>
            {rangeLoaded ? (
              <Carrousel
                title="Nearby Routes"
                data={nearbyListExperiences}
                navigation={navigation}
                token={token}
              />
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
            {experiencesLoaded ? (
              <Carrousel
                title="Premium Routes"
                data={listExperiences}
                navigation={navigation}
                token={token}
              />
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
            {guidesLoaded ? (
              <GuideCarrousel
                title="Guides"
                data={listGuides}
                navigation={navigation}
                token={token}
              />
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
          </View>
        ) : (
          <View style={{ marginLeft: '3%' }}>
            <Carrousel
              title="Results"
              data={filteredHouses}
              navigation={navigation}
              token={token}
            />
            <Stack alignItems="center">
              <Button
                onPress={() => {
                  setMin(0);
                  setMax(1000);
                  setMinR(0);
                  setMaxR(5);
                  setRange(300);
                  setFilters(false);
                  setDate(null);
                  setQuery('');
                }}
                leftIcon={<IconM as={MaterialIcons} name="delete" size="sm" />}
              >
                Clear Filters
              </Button>
            </Stack>
          </View>
        )}
      </ScrollView>
    );
  };
  const renderAppBar = () => {
    return (
      <>
        <StatusBar backgroundColor="#c2410c" barStyle="light-content" />
        <Box safeAreaTop />
      </>
    );
  };
  const theme = extendTheme({
    components: {
      IconButton: {
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
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} bg="#f5f5f5" safeAreaTop>
        {renderAppBar()}
        {renderFilters()}
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
          <StatusBar />
          <View style={style.header}>
            <Box>
              <Button
                backgroundColor="#fff"
                _text={{
                  color: appTheme.COLORS.gray,
                  fontSize: 'md',
                }}
                leftIcon={
                  <IconM as={<MaterialIcons name="location-on" />} size="sm" color="black" />
                }
                rightIcon={
                  <IconM as={MaterialIcons} name="arrow-drop-down" color="black" size="md" />
                }
                onPress={() => {
                  navigation.navigate('LocationScreen', { token: token });
                }}
              >
                {location}
              </Button>
            </Box>

            <View>
              <Text
                style={{ color: appTheme.COLORS.black, fontSize: 20, fontWeight: 'bold' }}
              ></Text>
            </View>
          </View>

          {renderScrollView()}

          <Footer select="0" navigation={navigation} token={token} isGuide={isGuide} />
        </SafeAreaView>
      </Box>
    </NativeBaseProvider>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

const style = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: appTheme.COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: appTheme.COLORS.orange,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  categoryListContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 25,
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
  facility: { flexDirection: 'row', marginRight: 15 },
  facilityText: { marginLeft: 5, color: appTheme.COLORS.gray },
});

export default HomeScreen;
