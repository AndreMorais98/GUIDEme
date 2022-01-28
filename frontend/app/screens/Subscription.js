import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  NativeBaseProvider,
  Box,
  extendTheme,
  View,
  Text,
  ScrollView,
  Heading,
  Button,
  FlatList,
} from 'native-base';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Footer } from '../components/footer';
import appTheme from '../constants/theme';


const SubscriptionPlan = ({ navigation, subPlan, mySubPlan, token }) => {

  return (
  <View style={style.subPlanContainer}>
    <Text style={{fontWeight: "bold", color: "rgb(234, 88, 12)"}}>{subPlan.designation}   <Text style={{ fontWeight: "bold", color: appTheme.COLORS.blue}}>{ (!subPlan.can_purhcase && subPlan.slug == mySubPlan.sub_plan) ? mySubPlan.plan_expire_date : "" }</Text></Text>
    <View style={style.subPlanBottom}>
      <Text width={"70%"} marginTop={3}>{subPlan.description}</Text>
      <View style={style.subPlanRight}>
        <Text marginBottom={3} fontWeight={"bold"}>{subPlan.price} €</Text>
        { mySubPlan.can_purchase ? <Button _text={{color: appTheme.COLORS.white}} onPress={() => navigation.navigate("Receipt", {token: token, subPlanSlug: subPlan.slug, price: subPlan.price})}>Purchase</Button> : <Button isDisabled >Purchase</Button>}
      </View>
    </View>
  </View>
  )
}

SubscriptionPlan.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  subPlan: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
};

const Subscription = ({ navigation, route }) => {
  const { token } = route.params;
  const [listSubsPlan, setListSubsPlan] = React.useState({});
  const [mySubPlan, setMySubPlan] = React.useState({});
  const [listLoaded, setListLoaded] = React.useState(false);
  const [mySubLoaded, setMySubLoaded] = React.useState(false);

  const getMySubPlan = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/users/subscription/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setMySubPlan(data);
          setMySubLoaded(true);
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

  const getListSubsPlan = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: 'Token ' + token },
    };
    fetch(`https://guideme-api.herokuapp.com/api/subscriptions/`, requestOptions)
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setListSubsPlan(data);
          setListLoaded(true);
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
    getListSubsPlan();
    getMySubPlan();
  }, []);

  const renderScrollView = () => {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.mainContainer}>
          <Heading style={style.heading}>Subscription Plans</Heading>
          { (listLoaded && mySubLoaded) ? <FlatList data={listSubsPlan} renderItem={({item}) => <SubscriptionPlan navigation={navigation} subPlan={item} token={token} mySubPlan={mySubPlan} />}/> : <ActivityIndicator size="large" color="#000000"/> }
        </View>
      </ScrollView>
    )
  }

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
        {renderScrollView()}
        <Footer select="2" navigation={navigation} token={token} isGuide={true}/>
      </Box>
    </NativeBaseProvider>
  );
};

Subscription.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

export default Subscription;


const style = StyleSheet.create({
  mainContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  heading : {
    marginTop: 20,
    marginBottom: 50,
  },
  subPlanContainer : {
    paddingVertical: 20,
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: "rgba(234, 88, 12, 0.1)",
    borderRadius: 30,
    borderColor: "rgb(234, 88, 12)",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subPlanBottom : {
    display: "flex",
    flexDirection: "row",
  },
  subPlanRight : {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
  }
});