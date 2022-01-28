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
  ScrollView,
} from 'native-base';

import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Footer } from '../components/footer';

const Terms = ({ navigation, route }) => {
  /**
   * @description - This function is used to render the tab bar
   * @param {object} props - props
   * @return {JSX} JSX
   * @memberof Terms
   */

  const { token } = route.params;

  function acceptTerms() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/set_guide/`, requestOptions)
      .then(response => {
        if (response.ok) {
          navigation.navigate('Profile', {token: token});
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
                    navigation.navigate('Profile', {token: token});
                  }}
                />
              }
            />
          </HStack>
          <HStack space="4" alignItems="center">
            <Text color="black" paddingRight="29%" fontSize="20" fontWeight="bold">
              Become a Guide
            </Text>
          </HStack>
        </HStack>
      </>
    );
  }

  /**
   * @description - This function is used to render the profile
   * @return {JSX} JSX
   * @memberof Terms
   */
  function renderWindow() {
    const myRef = React.useRef({});
    React.useEffect(() => {
      const styleObj = {
        backgroundColor: '#ea580c',
        borderColor: '#000000',
      };

      myRef?.current?.setNativeProps({
        style: styleObj,
      });
    }, [myRef]);

    const myRef1 = React.useRef({});
    React.useEffect(() => {
      const styleObj = {
        backgroundColor: '#ea580c',
        borderColor: '#000000',
      };

      myRef1?.current?.setNativeProps({
        style: styleObj,
      });
    }, [myRef1]);

    return (
      <View style={styles.boxText}>
        <ScrollView>
          <Text style={styles.textinBox}>
            {`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat. Velit ut tortor pretium viverra. Ultrices in iaculis nunc sed. Volutpat maecenas volutpat blandit aliquam etiam erat velit. Massa sed elementum tempus egestas. Accumsan sit amet nulla facilisi morbi tempus iaculis. Curabitur vitae nunc sed velit dignissim sodales ut eu. Faucibus interdum posuere lorem ipsum dolor. Nibh praesent tristique magna sit amet purus. Sit amet nisl purus in mollis nunc sed id. Ullamcorper eget nulla facilisi etiam. Odio ut sem nulla pharetra diam sit amet.Arcu dui vivamus arcu felis bibendum. Cum sociis natoque penatibus et magnis dis. Eget sit amet tellus cras. Nunc id cursus metus aliquam eleifend mi in.\n\nRhoncus mattis rhoncus urna neque viverra justo nec. In ornare quam viverra orci. Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Eu facilisis sed odio morbi quis. Nam at lectus urna duis convallis convallis. Et leo duis ut diam quam nulla. Tortor dignissim convallis aenean et tortor at risus viverra adipiscing. Donec pretium vulputate sapien nec sagittis aliquam. Massa massa ultricies mi quis hendrerit dolor magna eget. A condimentum vitae sapien pellentesque habitant morbi tristique senectus. Suspendisse sed nisi lacus sed. Sit amet nisl purus in mollis nunc. \n\nOdio euismod lacinia at quis. Placerat orci nulla pellentesque dignissim enim sit amet. Parturient montes nascetur ridiculus mus mauris vitae. Eget nulla facilisi etiam dignissim diam quis enim. In hac habitasse platea dictumst. Vel pharetra vel turpis nunc eget lorem dolor sed. Sed enim ut sem viverra aliquet eget sit amet tellus. Integer enim neque volutpat ac tincidunt. Leo vel fringilla est ullamcorper. Velit ut tortor pretium viverra suspendisse potenti nullam. At lectus urna duis convallis convallis tellus id interdum. Vitae congue eu consequat ac felis donec. Donec pretium vulputate sapien nec sagittis aliquam malesuada bibendum. Sapien faucibus et molestie ac feugiat sed. Enim nulla aliquet porttitor lacus. Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Faucibus turpis in eu mi bibendum neque.`}
          </Text>
        </ScrollView>
        <View style={styles.drawline} />
        <HStack style={{ paddingLeft: '28%' }} space="4" alignItems="center">
          <Button
            size="md"
            variant={'solid'}
            colorScheme="orange"
            onPress={() => {
              acceptTerms();
            }}
            _text={{ color: 'white' }}
            ref={myRef}
          >
            Accept
          </Button>

          <Button
            size="md"
            variant={'solid'}
            colorScheme="orange"
            onPress={() => {
              navigation.navigate('Profile', {token: token});
            }}
            _text={{ color: 'white' }}
            ref={myRef1}
          >
            Decline
          </Button>
        </HStack>
      </View>
    );
  }

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#f5f5f5" safeAreaTop>
        {renderAppBar()}
        <Center flex={1}>{renderWindow()}</Center>
        <Footer select="2" navigation={navigation} token={token}/>
      </Box>
    </NativeBaseProvider>
  );
};

Terms.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
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

export default Terms;
