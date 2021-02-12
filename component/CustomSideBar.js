import * as React from 'react';
import { TouchableOpacity,Text,View,StyleSheet} from 'react-native';
import {DrawerItems} from 'react-navigation-drawer';

import firebase from 'firebase';
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import {Icon} from 'react-native-elements';

import db from '../config';

import {RFValue} from 'react-native-responsive-fontsize';



export default class CustomSideBar extends React.Component{

    constructor(){
      super();
      this.state = {
        userId : firebase.auth().currentUser.email,
        image : '#',
        name : ''
      }

      this.userRef = null;
    }

    selectPicture = async()=>{
      const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
        mediaTypes : ImagePicker.MediaTypeOptions.All,
        allowsEditing : true,
        aspect : [4,3],
        quality : 1
      })

      if(!cancelled){
        this.uploadImage(uri,this.state.userId);
      }
    }

    uploadImage=async(uri, imageName)=>{
      var response = await fetch(uri);
      var blob = await response.blob();


      var ref = firebase.storage().ref().child("user_profiles/" + imageName);

      return ref.put(blob).then((response)=>{
        this.fetchImage(imageName);
      })
    }


    fetchImage = (imageName) =>{
      var storageRef = firebase.storage().ref().child("user_profiles/" + imageName);

      storageRef.getDownloadURL().then((url)=>this.setState({image:url}))
      .catch((error)=>{
        this.setState({image : '#'})
      })
    }

    getUserName = ()=>{
      this.userRef = db.collection("users").where("emailId","==",this.state.userId)
      .onSnapshot((snapshot)=>{
        snapshot.forEach((doc)=>{
          this.setState({
            name : doc.data().firstName + " " + doc.data().lastName
          })
        })
      })
    }

    componentDidMount(){
      this.getUserName();
      this.fetchImage(this.state.userId);
    }

    componentWillUnmount(){
      this.userRef();
    }



    render(){
        return(<View style={styles.container}>
            <View style={styles.drawerItemsContainer}>
              <Avatar
              rounded
              source = {{uri : this.state.image}}
              size = "xlarge"
              onPress = {()=>this.selectPicture()}
              //  containerStyle = {styles.imageContainer}
              showEditButton>

              </Avatar>
              <Text style={{fontSize:RFValue(20),fontWeight:'300',padding : RFValue(10),color: '#fff'}}>{this.state.name}</Text>
            </View>
            <View style={{flex : 0.6}}>
                <DrawerItems {...this.props}/>
            </View>
           
            <View style={styles.logOutContainer}>
            <TouchableOpacity style={styles.logOutButton} onPress={()=>{
                firebase.auth().signOut()
                this.props.navigation.navigate('WelcomeScreen')}}>
            <Icon name="logout" type="antdesign" size={RFValue(20)} iconStyle={{paddingLeft : RFValue(10)}} />     
            <Text style={styles.logOutText}>Logout</Text></TouchableOpacity>
            </View></View>)
    }
}


const styles = StyleSheet.create({
    container : {
        flex : 1
    },

    drawerItemsContainer:{
        flex:0.3,
        backgroundColor : '#32867d',
        justifyContent : 'center',
        alignItems : 'center'
      },
      logOutContainer : {
        flex:0.1,
      paddingBottom: 30,
      },
      logOutButton : {
        height:'100%',
        width:'100%',
        flexDirection : 'row',
      },
      logOutText:{
        fontSize: RFValue(15),
        fontWeight:'bold',
        marginLeft : RFValue(30)
      },
      // imageContainer:{
      //   flex : 0.75,
      //   width : '80%',
      //   height : '20%',
      //   marginTop : 30,
      //   marginLeft : 20,
      // }
})