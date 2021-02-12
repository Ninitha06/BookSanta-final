import * as React from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';

import firebase from 'firebase';
import db from '../config';
import MyHeader from '../component/MyHeader';

import {RFValue} from 'react-native-responsive-fontsize';

export default class SettingsScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            emailId : '',
            firstname : '',
            lastname : '',
            contact : '',
            address : '',
            docId : ''
        }
    }

    getUserDetails(){
        var user = firebase.auth().currentUser;
        var email = user.email;

        db.collection('users').where('emailId','==',email).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var data = doc.data();
                this.setState({
                    emailId : data.emailId,
                    firstname : data.firstName,
                    lastname : data.lastName,
                    contact : data.contact,
                    address : data.address,
                    docId : doc.id
                })
            })
        })
    }

    componentDidMount(){
        this.getUserDetails();
    }

    updateDetails(){
        db.collection('users').doc(this.state.docId)
        .update({
            firstName : this.state.firstname,
            lastName : this.state.lastname,
            contact : this.state.contact,
            address : this.state.address,
        })

        Alert.alert("User updated successfully");

    }

    render(){
        return(
        <View style={{flex : 1}}>
            <View style={{flex:0.12}}>
                <MyHeader title="Settings" navigation={this.props.navigation}></MyHeader>
            </View>
            <View style={styles.fontContainer}>
            <View
              style={{
                flex: 0.66,
                padding: RFValue(10),
              }}
            >
                 <Text style={styles.label}>First Name </Text>
                <TextInput style={styles.formInput} placeholder={"First Name"} onChangeText={(text)=>{this.setState({firstname : text})}} value={this.state.firstname}></TextInput>
                <Text style={styles.label}>Last Name </Text>
                <TextInput style={styles.formInput} placeholder={"Last Name"}onChangeText={(text)=>{this.setState({lastname : text})}} value={this.state.lastname}></TextInput>
                <Text style={styles.label}>Contact </Text>
                <TextInput style={styles.formInput} placeholder={"Contact"} onChangeText={(text)=>{this.setState({contact : text})}} value={this.state.contact}></TextInput>
                <Text style={styles.label}>Address </Text>
                <TextInput style={styles.formInput} placeholder={"Address"} onChangeText={(text)=>{this.setState({address : text})}} multiline={true} numberOfLines={8} value={this.state.address}></TextInput>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity style={styles.button} onPress={()=>this.updateDetails()}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
            </View>
            </View>
        </View>);
    }
}


const styles=StyleSheet.create({
    formInput : {
        width:"90%",
        height : RFValue(50),
        borderColor:'grey',
        borderRadius:2,
        borderWidth:1,
        marginBottom:RFValue(20),
        marginLeft:RFValue(20),
        padding:RFValue(10)
    },
    fontContainer : {
        flex : 0.88,
        justifyContent : 'center'
    },
    // multilineText : {
    //     textAlignVertical:'top',
    //     width:"90%",
    //     //height:35,
    //     alignSelf:'center',
    //     borderColor:'grey',
    //     borderRadius:2,
    //     borderWidth:1,
    //     marginBottom:RFValue(20),
    //     marginLeft:RFValue(20),
    //     padding:RFValue(10)
    // },
    label:{
        fontSize:RFValue(18),
        color:"#717D7E",
        fontWeight:'bold',
        padding:RFValue(10),
        marginLeft:RFValue(20)
      },
      buttonView:{
        flex: 0.22,
        alignItems: "center",
        marginTop:RFValue(100)
    },
    button : {
        width:"75%",
        height:RFValue(60),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#32867d",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop : RFValue(20)

    },
    buttonText : {
        color:'#ffff',
        fontWeight:'200',
        fontSize:RFValue(23)
    },

})