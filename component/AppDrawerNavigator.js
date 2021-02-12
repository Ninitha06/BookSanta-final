import * as React from 'react';

import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './AppTabNavigator';
import CustomSideBar from './CustomSideBar';
import SettingsScreen from '../screens/SettingsScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ReceivedBooksScreen from '../screens/ReceivedBooksScreen';

import {Icon} from 'react-native-elements';


export const AppDrawerNavigator = createDrawerNavigator({
    Home : {
        screen : AppTabNavigator,
        navigationOptions:{
            drawerIcon : <Icon name="home" type ="fontawesome5" />
          }
    },
    MyDonations : {
        screen : MyDonationsScreen,
        navigationOptions:{
            drawerIcon : <Icon name="gift" type ="font-awesome" />,
            drawerLabel : "My Donations"
          }
    },
    MyReceivedBooks : {
        screen : ReceivedBooksScreen,
        navigationOptions:{
            drawerIcon : <Icon name="gift" type ="font-awesome" />,
            drawerLabel : "My Received Books"
          }
    },
    Notifications : {
        screen : NotificationScreen,
        navigationOptions:{
            drawerIcon : <Icon name="bell" type ="font-awesome" />,
            drawerLabel : "Notifications"
          }
    },
    Settings : {
        screen : SettingsScreen,
        navigationOptions:{
            drawerIcon : <Icon name="settings" type ="fontawesome5" />,
            drawerLabel : "Settings"
          }
    },   
},
{
    contentComponent : CustomSideBar
},
{
    initialRouteName : 'Home'
})


