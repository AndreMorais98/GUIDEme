import React from 'react';
import { View, Text } from 'native-base';
import { StyleSheet, Dimensions, SafeAreaView, FlatList, Pressable, Image } from 'react-native';
import PropTypes from 'prop-types';
import appTheme from '../constants/theme';

const { width } = Dimensions.get('screen');

const Card = ({ navigation, experience, token }) => {
  return (
    <Pressable
      onPress={() => navigation.push('DetailsScreen', { experience: experience.pk, token: token })}
    >
      <View style={style.card}>
        <Image
          source={experience.images ? { uri: experience.images[0] } : null}
          style={style.cardImage}
        ></Image>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' }}>
            {experience.title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: 'rgb(234, 88, 12)',
            }}
          >
            {!!experience.price ? experience.price + ' €' : experience.date}
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
          {experience.description}
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

const Carrousel = ({ navigation, title, data, token }) => {
  return (
    <SafeAreaView>
      <View style={style.categoryListContainer}>
        <Text style={[style.categoryListText, style.activeCategoryListText]}>{title}</Text>
      </View>
      <FlatList
        snapToInterval={width - 20}
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingVertical: 20,
        }}
        horizontal
        data={data}
        renderItem={({ item }) => <Card experience={item} navigation={navigation} token={token} />}
      />
    </SafeAreaView>
  );
};

Carrousel.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
};

const GuideCard = ({ navigation, guide, token }) => {
  return (
    <Pressable onPress={() => navigation.push('ProfileVisit', { pk: guide.pk, token: token })}>
      <View style={style.guideCard}>
        <Image source={guide.image ? { uri: guide.image } : null} style={style.cardImage}></Image>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', flex: 1, flexWrap: 'wrap' }}>
            {guide.name}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: appTheme.COLORS.green,
            }}
          >
            {!!guide.num_rating ? `${guide.rating} (${guide.num_rating})` : `? (0)`}
          </Text>
        </View>
        <Text
          style={{
            color: appTheme.COLORS.gray,
            fontSize: 10,
            marginTop: 5,
            flex: 1,
            flexWrap: 'wrap',
          }}
        >
          {guide.location}
        </Text>
        <Text
          style={{
            color: appTheme.COLORS.gray,
            fontSize: 14,
            flex: 1,
            flexWrap: 'wrap',
            height: 40,
          }}
        >
          {guide.description}
        </Text>
      </View>
    </Pressable>
  );
};

GuideCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  guide: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const GuideCarrousel = ({ navigation, title, data, token }) => {
  return (
    <SafeAreaView>
      <View style={style.categoryListContainer}>
        <Text style={[style.categoryListText, style.activeCategoryListText]}>{title}</Text>
      </View>
      <FlatList
        snapToInterval={width - 20}
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingVertical: 20,
        }}
        horizontal
        data={data}
        renderItem={({ item }) => <GuideCard guide={item} navigation={navigation} token={token} />}
      />
    </SafeAreaView>
  );
};

GuideCarrousel.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  token: PropTypes.string.isRequired,
};

export { Carrousel, GuideCarrousel };

const style = StyleSheet.create({
  card: {
    height: 250,
    backgroundColor: appTheme.COLORS.white,
    elevation: 10,
    width: width - 130,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  guideCard: {
    backgroundColor: appTheme.COLORS.white,
    elevation: 10,
    width: width - 180,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
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
