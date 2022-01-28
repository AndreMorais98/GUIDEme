import React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, Dimensions, SafeAreaView, FlatList, Pressable, Image } from 'react-native';
import PropTypes from 'prop-types';
import appTheme from '../constants/theme';

const { width } = Dimensions.get('screen');

const Card = ({ navigation, experience, token }) => {
  return (
    <Pressable
      onPress={() =>
        navigation.push('DetailsScreen', { experience: experience.experience.pk, token: token })
      }
    >
      <View style={style.card}>
        <Image
          source={experience.experience.images ? { uri: experience.experience.images[0] } : null}
          style={style.cardImage}
        ></Image>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' }}>
            {experience.experience.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: appTheme.COLORS.green,
            }}
          >
            {!!experience.experience.price
              ? experience.experience.price + ' €'
              : experience.experience.date}
          </Text>
        </View>
        <Text
          style={{
            color: appTheme.COLORS.gray,
            fontSize: 14,
            marginTop: 5,
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          {experience.experience.location}
        </Text>
        <Text>
          {experience.date.split('T')[0]} | {experience.date.split('T')[1].split('Z')[0]} H
        </Text>
      </View>
    </Pressable>
  );
};

Card.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  experience: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const HCarrousel = ({ navigation, title, data, token }) => {
  return (
    <SafeAreaView>
      <View style={style.categoryListContainer}>
        <Text style={[style.categoryListText, style.activeCategoryListText]}>{title}</Text>
      </View>
      <FlatList
        data={data}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 1 }}>
            <Card experience={item} navigation={navigation} token={token} />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

HCarrousel.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
};

export { HCarrousel };

const style = StyleSheet.create({
  card: {
    height: 250,
    backgroundColor: appTheme.COLORS.white,
    elevation: 10,
    width: width - 50,
    marginRight: 20,

    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  categoryListContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 5,
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
});
