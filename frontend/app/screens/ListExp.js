import React, { useEffect, useState } from 'react';
import {
  NativeBaseProvider,
  Box,
  View,
  HStack,
  StatusBar,
  IconButton,
  Text,
  Icon as NativeBaseIcon,
  Icon,
  extendTheme,
  ScrollView,
} from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';

import appTheme from '../constants/theme';
import PropTypes from 'prop-types';

import { Footer } from '../components/footer';
import { HCarrousel } from '../components/hcarroussel';
import {
  StyleSheet,
  TextInput,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { LocaleConfig } from 'react-native-calendars';

const { width } = Dimensions.get('screen');

LocaleConfig.defaultLocale = 'en';
const ListExp = ({ navigation, route }) => {
  const { token, isGuide } = route.params;
  const [experiencesLoaded, setExperiencesLoaded] = React.useState(false);
  const [listExperiences, setListExperiences] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);


  const getListExperiences = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/experiences/tickets/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setListExperiences(data);
          setExperiencesLoaded(true);
          setRefreshing(false);
        } else {
          response
            .json()
            .then(responseJson => {
              console.log('tickets', responseJson);
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
  }, []);

  useEffect(() => {
    getListExperiences();
  }, []);

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof EditPass
   */

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
              My Experiences
            </Text>
          </HStack>
        </HStack>
      </>
    );
  };
  const [query, setQuery] = useState('');
  const [filteredHouses, setFilteredHouses] = useState([]);

  const handleSearch = query => {
    setQuery(query);

    const filtered = listExperiences.filter(route => {
      // eslint-disable-next-line react/prop-types
      return route.title.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredHouses(filtered);
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
            <Icon as={MaterialIcons} size="25" color={appTheme.COLORS.gray} name="search" />

            <TextInput
              value={query}
              onChange={text => {
                handleSearch(text.nativeEvent.text);
              }}
              placeholder="Search experiences"
            ></TextInput>
          </View>
        </View>
        {query.length == 0 ? (
          <View style={{ marginLeft: '3%' }}>
            {experiencesLoaded ? (
              <HCarrousel title="" data={listExperiences} navigation={navigation} token={token} />
            ) : (
              <ActivityIndicator size="large" color="#000" />
            )}
          </View>
        ) : (
          <HCarrousel title="" data={filteredHouses} navigation={navigation} token={token} />
        )}
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
        <Footer select="1" navigation={navigation} isGuide={isGuide} token={token} />
      </Box>
    </NativeBaseProvider>
  );
};

ListExp.propTypes = {
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
  searchInputContainer: {
    height: 50,
    backgroundColor: appTheme.COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
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

export default ListExp;
