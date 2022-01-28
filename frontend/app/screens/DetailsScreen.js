import React, { useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import appTheme from '../constants/theme';
import { MaterialCommunityIcons, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { Footer } from '../components/footer';
import {
  NativeBaseProvider,
  Avatar,
  Button,
  AlertDialog,
  IconButton,
  Collapse,
  Alert,
  VStack,
  HStack,
  CloseIcon,
  FormControl,
  Input,
  Radio,
  TextArea,
} from 'native-base';
import { SliderBox } from 'react-native-image-slider-box';

import Tags from 'react-native-tags';
import { Comments } from '../components/comments';

const { width } = Dimensions.get('screen');

const DetailsScreen = ({ navigation, route }) => {
  const [showForm, setShowForm] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [experience, setExperience] = React.useState({});
  const [refreshing, setRefreshing] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [commentField, setCommentField] = React.useState(null);
  const [ratingValue, setRatingValue] = React.useState(null);

  const token = route.params.token;
  const exp_pk = route.params.experience;

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

  function cancelExperience() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    }
    fetch(`https://guideme-api.herokuapp.com/api/experiences/${exp_pk}/cancel/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.push('HomeScreen', { token: token });
        }
        else {
          response
          .json()
          .then(responseJson => {
            console.log(responseJson)
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const publishComment = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
      body: JSON.stringify({
        comment: commentField,
        rating: ratingValue,
      }),
    }
    fetch(`https://guideme-api.herokuapp.com/api/experiences/${exp_pk}/reviews/`, requestOptions)
      .then(response => {
        if (response.ok) {
          setRefreshing(true);
          setShowForm(false);
          getExperience();
        }
        else {
          response
            .json()
            .then(responseJson => {
              if (responseJson.comment) {
                setError("Comment: " + responseJson.comment[0]);
              }
              if (responseJson.rating) {
                setError("Rating: " + responseJson.rating[0]);
              }
              else {
                setError(responseJson.non_field_errors[0]);
              }
              setShowModal(true);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }

  const getExperience = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    }; 
    fetch(`https://guideme-api.herokuapp.com/api/experiences/${exp_pk}/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setExperience(data);
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getExperience();
  }, []);

  useEffect(() => {
    getExperience();
  }, []);


  const renderScrollView = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {
          (!loaded) ?
            <ActivityIndicator size="large" color="#000000" />
            :
            <View>
              {/* Experience image */}
              <View style={style.backgroundImageContainer}>
                <View style={style.backgroundImage}>
                  <SliderBox
                    images={experience.images}
                    sliderBoxHeight={200}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={20}
                    circleLoop
                    resizeMethod={'resize'}
                    resizeMode={'cover'}
                    paginationBoxStyle={{
                      position: 'absolute',
                      bottom: 0,
                      padding: 0,
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      paddingVertical: 10,
                    }}
                    dotStyle={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      marginHorizontal: 0,
                      padding: 0,
                      margin: 0,
                      backgroundColor: 'rgba(128, 128, 128, 0.92)',
                    }}
                    ImageComponentStyle={{
                      borderRadius: 15,
                      width: '97%',
                      marginTop: 5,
                      height: '100%',
                      width: '100%',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                    imageLoadingColor="#2196F3"
                  />
                  <View style={style.header}>
                    <View style={style.headerBtn}>
                      <Icon name="arrow-back-ios" size={20} onPress={navigation.goBack} />
                    </View>
                  </View>
                </View>
                {/* </ImageBackground> */}
              </View>

              <View style={style.detailsContainer}>

                <View style={style.virtualTag}>
                  <Text style={{ textAlign: "center", color: appTheme.COLORS.white }}>{experience.title}</Text>
                </View>

                {/* Name and rating view container */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <TouchableOpacity style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "65%" }} onPress={() => navigation.push("ProfileVisit", { token: token, pk: experience.guide.pk })}>
                    <Avatar size="lg" source={{ uri: experience.guide.image }}></Avatar>
                    <Text
                      style={{
                        fontSize: 18,
                        marginLeft: 4,
                        flex: 1,
                        flexWrap: "wrap",
                        fontWeight: 'bold',
                      }}
                    >
                      {experience.guide.name}
                    </Text>
                  </TouchableOpacity>

                  {
                    !!experience.num_rating ?
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={style.ratingTag}>
                          <Text style={{ color: appTheme.COLORS.white }}>{experience.rating}</Text>
                        </View>
                        <Text style={{ fontSize: 13, marginLeft: 5 }}>{experience.num_rating} ratings</Text>
                      </View>
                      : null
                  }
                </View>

                {/* Location text */}
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={style.facility}>
                    <MaterialIcons name="place" size={24} color="black" />
                    <Text style={{ fontSize: 16, color: appTheme.COLORS.gray }}>{experience.location}</Text>
                  </View>
                </View>

                {/* Facilities container */}
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <View style={style.facility}>
                    <MaterialCommunityIcons name="account-group" size={24} color="black" />
                    <Text style={style.facilityText}>{experience.participants_limit}</Text>
                  </View>
                  <View style={style.facility}>
                    <Entypo name="back-in-time" size={24} color="black" />
                    <Text style={style.facilityText}>{experience.duration} hours</Text>
                  </View>
                  {
                    !!experience.date ?
                      <View style={style.facility}>
                        <FontAwesome name="calendar-times-o" size={24} color="black" />
                        <Text style={style.facilityText}>{experience.date}</Text>
                      </View>
                      :
                      <View style={style.facility}>
                        <FontAwesome name="calendar-times-o" size={24} color="black" />
                        <Text style={style.facilityText}>{experience.start_date}</Text>
                      </View>
                  }
                </View>

                <SafeAreaView>
                  <View style={style.categoryListContainer}>
                    <Text style={[style.categoryListText, style.activeCategoryListText]}>Keywords</Text>
                  </View>
                  <Tags
                    initialTags={experience.keywords}
                    containerStyle={{ justifyContent: 'center' }}
                    readonly={true}
                    renderTag={({ tag, index, readonly }) => (
                      <TouchableOpacity key={`${tag}-${index}`} style={style.tag}>
                        <Text style={style.textTag}> {tag} </Text>
                      </TouchableOpacity>
                    )}
                  />
                </SafeAreaView>

                {!!experience.schedule.length ? <SafeAreaView>
                  <View style={style.categoryListContainer}>
                    <Text style={[style.categoryListText, style.activeCategoryListText]}>Schedule</Text>
                  </View>
                  <FlatList
                    contentContainerStyle={{
                      paddingHorizontal: 5,
                      paddingVertical: 5,
                    }}
                    data={experience.schedule}
                    renderItem={({ item }) => {
                      return (
                        <View style={style.scheduleItem}>
                          <Text style={{ fontWeight: "bold", paddingRight: 30 }}>{item.week_day}:</Text>
                          <Text>{item.time}</Text>
                        </View>
                      )
                    }}
                  />
                </SafeAreaView> : null}

                {/* footer container */}
                <View style={style.footer}>
                  <View>
                    <Text style={{ color: appTheme.COLORS.blue, fontWeight: 'bold', fontSize: 18 }}>
                      {experience.price} €
                    </Text>
                    <Text style={{ fontSize: 12, color: appTheme.COLORS.gray, fontWeight: 'bold' }}>
                      Total Price
                    </Text>
                  </View>
                  {experience.can_book ? <Button style={style.bookNowBtn} _text={{ color: appTheme.COLORS.white }} onPress={() => { navigation.push('BookingScreen', { token: token, experience: exp_pk, schedule: experience.schedule, date: experience.date, startDate: experience.start_date, price: experience.price }); }}>Book Now</Button> : experience.can_cancel ? <Button style={style.cancelButton} onPress={() => setIsCancelModalOpen(!isCancelModalOpen)}>Cancel</Button> : null}
                  <AlertDialog isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)}>
                    <AlertDialog.Content>
                      <AlertDialog.CloseButton />
                      <AlertDialog.Header>Cancel Experience</AlertDialog.Header>
                      <AlertDialog.Body>
                        This action is irreversible, are you sure you want to cancel this experience?
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button.Group space={2}>
                          <Button variant="unstyled" colorScheme="coolGray" onPress={() => setIsCancelModalOpen(false)}>
                            No
                          </Button>
                          <Button colorScheme="danger" onPress={cancelExperience}>
                            Confirm
                          </Button>
                        </Button.Group>
                      </AlertDialog.Footer>
                    </AlertDialog.Content>
                  </AlertDialog>
                </View>
                <Text style={{ marginTop: 10, marginBottom: 10, color: appTheme.COLORS.gray }}>{experience.description}</Text>
              </View>


              { experience.can_review ?
              <View style={style.commentForm}>
                <IconButton style={style.addFormBtn} icon={<Icon as={MaterialIcons} name="add-circle" color="rgb(234, 88, 12)" size={20} />} onPress={() => setShowForm(!showForm)} />

                {showForm ?
                <View marginTop={20} marginBottom={20}>
                    {advice(error)}
                    <Text style={{fontWeight: "bold", marginBottom: 5}}>Rating</Text>
                    <Radio.Group
                      colorScheme='warning'
                      value={ratingValue}
                      style={style.radioGroup}
                      onChange={(nextValue) => {
                        setRatingValue(nextValue);
                      }}
                    >
                      <Radio value="1" mx="1">
                        1
                      </Radio>
                      <Radio value="2" mx="1">
                        2
                      </Radio>
                      <Radio value="3" mx="1">
                        3
                      </Radio>
                      <Radio value="4" mx="1">
                        4
                      </Radio>
                      <Radio value="5" mx="1">
                        5
                      </Radio>
                    </Radio.Group>

                    <FormControl marginTop={5}>
                      <FormControl.Label _text={{ bold: true }}>Comment</FormControl.Label>
                      <TextArea
                        _focus={{borderColor: 'rgb(234, 88, 12)'}}
                        variant="outline"
                        width={300}
                        placeholder="Comment"
                        style={{ marginBottom: 15 }}
                        onChangeText={value => setCommentField(value)}
                      />
                    </FormControl>

                    <Button backgroundColor='rgb(234, 88, 12)' onPress={publishComment}>Send Review</Button>
                  </View>
                  : null}
              </View>
              : null}
              <Comments navigation={navigation} comments={experience.reviews} token={token} />
            </View>
        }
      </ScrollView>
    );
  };

  return (
    <NativeBaseProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: appTheme.COLORS.white }}>
        {renderScrollView()}
        <Footer select="0" navigation={navigation} token={token} />
      </SafeAreaView>
    </NativeBaseProvider>
  );
};

DetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

const style = StyleSheet.create({
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    height: 350,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 1,
    position: 'absolute',
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
    backgroundColor: appTheme.COLORS.blue,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  virtualTag: {
    marginLeft: "auto",
    marginRight: "auto",
    width: "70%",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 5,
    textAlign: "center",
    backgroundColor: appTheme.COLORS.black,
  },
  radioGroup: {
    display: "flex",
    flexDirection: "row",
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  categoryListContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 5,
    marginBottom: 10,
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
  footer: {
    height: 70,
    backgroundColor: appTheme.COLORS.light,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bookNowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(234, 88, 12)',
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  cancelButton: {
    height: 50,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appTheme.COLORS.red,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  scheduleItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  screen: {
    flex: 1,
    backgroundColor: '#D6D6D6',
  },
  container: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
  },
  commentForm: {
    display: "flex",
    alignItems: "center",
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
  input: {
    backgroundColor: '#FFFFFF',
    color: '#606060',
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
    elevation: 21,
    marginBottom: 20,
  },
  facility: { flexDirection: 'row', marginRight: 15 },
  facilityText: { marginLeft: 5, color: appTheme.COLORS.gray },
});

export default DetailsScreen;
