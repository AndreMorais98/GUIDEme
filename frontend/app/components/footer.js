import React from 'react';
import { Text, Icon, HStack, Center } from 'native-base';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Entypo, Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const Footer = ({ token, isGuide, pk, select, navigation }) => {
  const [footerSelected] = React.useState(parseInt(select));

  return (
    <HStack alignItems="center" safeAreaBottom shadow={6} bg="white">
      <Pressable
        py="3"
        flex={1}
        onPress={() => {
          navigation.navigate('HomeScreen', { token: token, isGuide: isGuide });
        }}
      >
        <Center>
          <Icon
            mt="1"
            as={<MaterialCommunityIcons name={footerSelected === 0 ? 'home' : 'home-outline'} />}
            color={footerSelected === 0 ? '#ea580c' : '#525252'}
            size="sm"
          />
          <Text mb="1" color={footerSelected === 0 ? '#ea580c' : '#525252'} fontSize="12">
            Home
          </Text>
        </Center>
      </Pressable>

      {isGuide ? (
        <Pressable
          py="2"
          flex={1}
          onPress={() => {
            navigation.navigate('ExpForm', { token: token, photos: [], isGuide: isGuide });
          }}
        >
          <Center>
            <Icon
              mt="1"
              as={<Ionicons name="add-circle" />}
              color={footerSelected === 3 ? '#ea580c' : '#525252'}
              size="sm"
            />
            <Text mb="1" color={footerSelected === 3 ? '#ea580c' : '#525252'} fontSize="12">
              Add
            </Text>
          </Center>
        </Pressable>
      ) : null}
      <Pressable
        py="2"
        flex={1}
        onPress={() => {
          navigation.navigate('ListExp', { token: token, isGuide: isGuide });
        }}
      >
        <Center>
          <Icon
            mt="1"
            as={<Entypo name="ticket" />}
            color={footerSelected === 1 ? '#ea580c' : '#525252'}
            size="sm"
          />
          <Text mb="1" color={footerSelected === 1 ? '#ea580c' : '#525252'} fontSize="12">
            Exp
          </Text>
        </Center>
      </Pressable>

      <Pressable
        py="2"
        flex={1}
        onPress={() => {
          navigation.navigate('Profile', { token: token });
        }}
      >
        <Center>
          <Icon
            mt="1"
            as={
              <MaterialCommunityIcons name={footerSelected === 2 ? 'account' : 'account-outline'} />
            }
            color={footerSelected === 2 ? '#ea580c' : '#525252'}
            size="sm"
          />
          <Text mb="1" color={footerSelected === 2 ? '#ea580c' : '#525252'} fontSize="12">
            Account
          </Text>
        </Center>
      </Pressable>
    </HStack>
  );
};

Footer.propTypes = {
  select: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export { Footer };
