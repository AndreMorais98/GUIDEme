import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {
  Edit,
  ForgotPass,
  EditPass,
  Terms,
  SignIn,
  SignUp,
  Profile,
  Receipt,
  HomeScreen,
  DetailsScreen,
  LocationScreen,
  LandingPage,
  ExpForm,
  ProfileVisit,
  ImageScreen,
  Subscription,
  ListExp,
  BookingScreen,
} from './screens';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="LandingPage"
      >
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen name="EditPass" component={EditPass} />
        <Stack.Screen name="Terms" component={Terms} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Receipt" component={Receipt} />
        <Stack.Screen name="LandingPage" component={LandingPage} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        <Stack.Screen name="LocationScreen" component={LocationScreen} />
        <Stack.Screen name="ExpForm" component={ExpForm} />
        <Stack.Screen name="ProfileVisit" component={ProfileVisit} />
        <Stack.Screen name="Subscriptions" component={Subscription}/>
        <Stack.Screen name="BookingScreen" component={BookingScreen} />
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
          options={{
            title: 'Selected 0 files',
          }}
        />
        <Stack.Screen name="ListExp" component={ListExp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
