import React, { useState } from 'react';
import { SafeAreaView } from "react-native";
import PropTypes from 'prop-types';
import {
  NativeBaseProvider,
  ScrollView,
  View,
  Heading,
  Text,
  FlatList,
  Alert,
  Button,
  Center,
  Collapse,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Radio,
} from 'native-base';
import { StyleSheet } from 'react-native';
import { Footer } from '../components/footer';
import appTheme from '../constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

const BookingScreen = ({ navigation, route }) => {
  const token = route.params.token;
  const expPk = route.params.experience;
  const expSchedule = route.params?.schedule;
  const expPrice = route.params?.price;
  const expDate = route.params?.date;
  const expTime = route.params?.time;
  const expStartDate = route.params?.startDate;
  const today = new Date ();
  const minDate = new Date(expStartDate);
  const defaultDate = minDate > today ? minDate : today
  const [error, setError] = useState(null);
  const [date, setDate] = useState(defaultDate);
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(false);
  const [timeValue, setTimeValue] = React.useState(null);

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

  function bookExperience(date, time, nextRouteParams) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
      body: JSON.stringify({
        date: date,
        time: time,
        check: true,
      }),
    }
    fetch(`https://guideme-api.herokuapp.com/api/experiences/${expPk}/book/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          navigation.push("Receipt", nextRouteParams);
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

  const allowedDays = () => {
    var ret = []
    for(var i=0; i < expSchedule.length; i++) {
      ret.push(expSchedule[i].week_day);
    }
    return ret;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    if (selectedDate)
      setSelectedDate(true);
    setTimeValue(null)
  };

  const showDatepicker = () => {
    setShow(true)
  };

  const parseDay = (day) => {
    switch (day) {
      case 0:
        return "Sunday";
      case 1:
        return "Monday";
      case 2:
        return "Tuesday";
      case 3:
        return "Wednesday";
      case 4:
        return "Thursday";
      case 5:
        return "Friday";
      case 6:
        return "Saturday";
    }
  }

  const TimePicker = () => {
    const weekDay = parseDay(date.getDay())
    var timeChoices = []
    for(var i=0; i < expSchedule.length; i++) {
      if (weekDay == expSchedule[i].week_day) {
        timeChoices = expSchedule[i].time.split(" | ");
      }
    }    
    var renderChoices = []
    for (var i=0; i < timeChoices.length; i++) {
      renderChoices.push(
        <Radio value={timeChoices[i]}>
          {timeChoices[i]}
        </Radio>
      )
    }
    
    return (
      <View>
        <Text style={{fontWeight: "bold", marginBottom: 10}}>{date.toDateString()}</Text>
        <Radio.Group
          name="timePicker"
          value={timeValue}
          colorScheme='warning'
          onChange={(nextValue) => {
            setTimeValue(nextValue);
          }}
        >
          {renderChoices}
        </Radio.Group>
      </View>
    )
  }

  const Schedule = () => {
    return (
      <Center>
        <Text>You selected a periodic experience. You can choose the date you want to book. This experience is availbale in the following days:</Text>
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
          data={expSchedule}
          style={{marginTop: 20}}
          renderItem={({ item }) => {
            return(
              <View style={style.scheduleItem}>
                <Text style={{fontWeight: "bold", paddingRight: 30}}>{item.week_day}:</Text>
                <Text>{item.time}</Text>
              </View>
            )           
          }}
        />
        <Text>This experience starts or started at {expStartDate}.</Text>
        <Button onPress={showDatepicker} style={style.dateBtn}>Chose date</Button>
        {show && (<DateTimePicker
          value={date}
          mode="date"
          minimumDate={defaultDate}
          onChange={onChange}
          is24Hour={true}
          display="default" />)}
        {selectedDate ? allowedDays().includes(parseDay(date.getDay())) ? <TimePicker/> : <Text>Invalid date</Text> : null}
        {timeValue ? <Button marginTop={3} backgroundColor="rgb(234, 88, 12)" width={150} height={50} borderRadius={20} onPress={() => bookExperience(date.toISOString().split('T')[0], timeValue, { token: token, price: expPrice, expPk: expPk, expDate: date.toISOString().split('T')[0], expTime: timeValue})}>Book Now</Button>: null}
      </Center>
    )
  }

  const renderScrollView = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <SafeAreaView style={style.mainContainer}>
          <Heading style={{marginTop: 20, marginBottom: 20}}>Booking</Heading>
          {advice(error)}
          <View style={{marginTop: 30}}>
            { expDate ? <Text>You selected a one time experience. There's only one date available: <Text fontWeight="bold">{expDate} {expTime}</Text></Text> : <Schedule/>}
            {expDate ? <Button marginTop={10} backgroundColor="rgb(234, 88, 12)" width={150} height={50} borderRadius={20} onPress={() => bookExperience(new Date(expDate).toISOString().split('T')[0], new Date(expDate).toTimeString().split(' ')[0], { token: token, price: expPrice, expPk: expPk, expDate: new Date(expDate).toISOString().split('T')[0], expTime: new Date(expDate).toTimeString().split(' ')[0]})}>Book Now</Button>: null}
          </View>
        </SafeAreaView>
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

BookingScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

const style = StyleSheet.create({
  mainContainer: {
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  scheduleItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  dateBtn: {
    marginVertical: 10,
    backgroundColor: 'rgb(234, 88, 12)',
  },
});

export default BookingScreen;