import React, { useEffect } from 'react';
import {
  NativeBaseProvider,
  Box,
  View,
  HStack,
  Avatar,
  StatusBar,
  IconButton,
  Button,
  Text,
  Icon as NativeBaseIcon,
  extendTheme,
  ScrollView,
} from 'native-base';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import appTheme from '../constants/theme';
import { Carrousel } from '../components/carroussel';
import { Footer } from '../components/footer';
import { MaterialIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { Comments } from '../components/comments';

const { width } = Dimensions.get('screen');

const Profile = ({ navigation, route }) => {
  const { token } = route.params;
  const [user, setUser] = React.useState({});
  const [loaded, setLoaded] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getUser();
  }, []);

  const renderAppBar = () => {
    return (
      <>
        <StatusBar backgroundColor="#c2410c" barStyle="light-content" />
        <Box safeAreaTop />
      </>
    );
  };

  const renderButton = () => {
    return !!!user.is_guide ? (
      <Button
        textAlign="center"
        variant="solid"
        _text={{ color: 'white' }}
        style={{ marginTop: '5%', marginRight: '5%' }}
        onPress={() => {
          navigation.navigate('Terms', { token: token });
        }}
      >
        Become a Guide
      </Button>
    ) : null;
  };
  const deleteLocalToken = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('SignIn', {});
  };

  const getUser = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/profile/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setLoaded(true);
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

  useEffect(() => {
    getUser();
  }, []);

  const renderScrollView = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={style.backgroundImageContainer}>
          {/* Imagem do header */}
          <ImageBackground
            style={style.backgroundImage}
            source={{uri: user.header_pic}}
          >
            <HStack space="4" alignItems="center" justifyContent="space-between">
              {/* Go back button */}
              <IconButton
                icon={
                  <NativeBaseIcon
                    as={<MaterialIcons name="keyboard-backspace" />}
                    size="md"
                    color="black"
                    marginLeft={1}
                    marginTop={1}
                    borderWidth={1}
                    backgroundColor="white"
                    onPress={() => {
                      navigation.push('HomeScreen', { token: token });
                    }}
                    style={style.buttonGoBack}
                  />
                }
              />
              {/* Logout Button */}
              <IconButton
                icon={
                  <NativeBaseIcon
                    as={<MaterialIcons name="logout" />}
                    size="md"
                    color="black"
                    marginRight={1}
                    marginTop={1}
                    borderWidth={1}
                    backgroundColor="white"
                    onPress={() => deleteLocalToken()}
                    style={style.buttonLogout}
                  />
                }
              />
            </HStack>
          </ImageBackground>
          {/* Foto de perfil */}
          {loaded ? (
            <Avatar
              marginTop={-50}
              marginLeft={5}
              bg="warmGray.50"
              size="xl"
              borderWidth={3}
              borderColor={appTheme.COLORS.white}
              source={{ uri: user.profile_pic }}
            />
          ) : null}
        </View>
        {/* Botão para editar perfil */}
        <View style={style.buttonsContainer}>
          { user.is_guide ? <Button variant="outline" style={{ marginRight: '5%'}} onPress={() => {navigation.push('Subscriptions', { token: token });}}>Subscriptions</Button> : null }
          <Button variant="outline" onPress={() => {navigation.push('Edit', { token: token });}}>Edit Profile</Button>
        </View>
        <View style={style.detailsContainer}>
          {/* Name and rating view container */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' }}>
              {user.first_name} {user.last_name}
            </Text>

            {user.is_guide ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!user.rating ? (
                  <View backgroundColor="warning.600" style={style.ratingTag}>
                    <Text style={{ color: appTheme.COLORS.white }}>{user.rating}</Text>
                  </View>
                ) : null}
                <Text style={{ fontSize: 13, marginLeft: 5, paddingRight: 20 }}>
                  {user.num_rating} reviews
                </Text>
              </View>
            ) : null}
          </View>

          {/* Location text */}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={style.facility}>
              <Icon name="home" size={18} />
              <Text style={style.facilityText}>
                {user.district}, {user.country}
              </Text>
            </View>
          </View>

          {/* Phone number */}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <View style={style.facility}>
              <Icon name="phone" size={18} />
              <Text style={style.facilityText}>{user.phone}</Text>
            </View>
          </View>

          {/* Description text */}
          <Text style={{ marginTop: 20, color: appTheme.COLORS.gray, paddingRight: 10 }}>
            {user.description}
          </Text>

          {/* Botão "Become a Guide" se não for guia */}
          {renderButton()}

          {/* Experiências */}
          {user.is_guide ? loaded ? <Carrousel title="Next Experiences" data={user.guide_experiences} navigation={navigation} token={token} /> : <ActivityIndicator size="large" color="#000000" /> : null}

          {/* Histórico  */}
          { loaded ? <Carrousel title="History" data={user.last_exp} navigation={navigation} token={token} /> : <ActivityIndicator size="large" color="#000000" />}
        </View>

        {
          user.is_guide ? 
          <View style={{ marginTop: 30 }}>
            <Comments navigation={navigation} comments={user.reviews} token={token}/>
          </View>
          :
          null
        }
      </ScrollView>
    );
  };

  const theme = extendTheme({
    components: {
      Button: {
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
        <Footer select="2" navigation={navigation} token={token} isGuide={user.is_guide} />
      </Box>
    </NativeBaseProvider>
  );
};

Profile.propTypes = {
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
  buttonLogout: {
    borderRadius: 32,
    height: 40,
    width: 40,
    opacity: 0.8,
    paddingLeft: 7,
    paddingTop: 5,
  },
  backgroundImageContainer: {
    elevation: 20,
    height: 180,
  },
  backgroundImage: {
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
  detailsContainer: { flex: 1, paddingLeft: 20, marginTop: 30 },
  facility: { flexDirection: 'row', marginRight: 15 },
  facilityText: { marginLeft: 5, color: appTheme.COLORS.gray },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: '40%',
    marginRight: '4%',
    marginTop: '2%',
  }
});

export default Profile;