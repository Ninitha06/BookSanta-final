import * as React from 'react';
import {View, Text, StyleSheet,TextInput,TouchableOpacity,Alert,Modal, ScrollView,Image} from 'react-native';
import firebase from 'firebase';
import db from '../config';


import {RFValue} from 'react-native-responsive-fontsize';

export default class WelcomeScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            emailId : '',
            password : '',
            isModalVisible : false,
            firstname : '',
            lastname : '',
            address : '',
            contact : '',
            confirmPassword : ''
        }
    }

    login = (emailId,passwd)=>{
        firebase.auth().signInWithEmailAndPassword(emailId,passwd)
        .then(()=>{
            this.props.navigation.navigate("RequestBooks");
        })
        .catch((error)=>{
            var errorCode = error.code;
            var errorMsg = error.message;
            return Alert.alert(errorMsg);
        })
    }

    signUp = (emailId,passwd,confirmPasswd)=>{
        if(passwd !== confirmPasswd){
            console.log(passwd);
            console.log(confirmPasswd);
            Alert.alert("Passwords did not match. \n Please check your passwords")
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(emailId,passwd)
            .then(()=>{
                db.collection("users").add({
                    firstName : this.state.firstname,
                    lastName : this.state.lastname,
                    contact : this.state.contact,
                    address : this.state.address,
                    emailId : this.state.emailId,
                    IsBookRequestActive: false
                })
                //iOS has style parameter
                return Alert.alert(
                    "User created succcessfully",
                    "",
                    [
                        {text : 'OK', onPress : ()=>this.setState({isModalVisible : false})}
                    ]);
            })
            .catch((error)=>{
                var errorCode = error.code;
                var errorMsg = error.message;
                return Alert.alert(errorMsg);
            })
        }
    }

    showModal = ()=>{
        return(
            <Modal animationType="slide" transparent={false} visible={this.state.isModalVisible}>
                
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.signupView}>
                            <Text style={styles.signUpText}>Sign Up</Text>
                        </View>
                        <View style={{ flex: 0.95 }}>
                            <Text style={styles.label}>First Name </Text>
                            <TextInput style = {styles.formInput} placeholder="First Name" maxLength={12} onChangeText={(text)=>this.setState({firstname : text})}></TextInput>
                            <Text style={styles.label}>Last Name </Text>
                            <TextInput style = {styles.formInput} placeholder="Last Name" maxLength={12} onChangeText={(text)=>this.setState({lastname : text})}></TextInput>
                            <Text style={styles.label}>Contact </Text>
                            <TextInput style = {styles.formInput} placeholder="Contact" maxLength={10} keyboardType="numeric" onChangeText={(text)=>this.setState({contact : text})}></TextInput>
                            <Text style={styles.label}>Address </Text>
                            <TextInput style = {styles.formInput} placeholder="Address" multiline={true} onChangeText={(text)=>this.setState({address : text})}></TextInput>
                            <Text style={styles.label}>Email </Text>
                            <TextInput style = {styles.formInput} placeholder="email@address" keyboardType="email-address" onChangeText={(text)=>this.setState({emailId : text})}></TextInput>
                            <Text style={styles.label}>Password </Text>
                            <TextInput style = {styles.formInput} placeholder="Password" secureTextEntry={true} onChangeText={(text)=>this.setState({password : text})}></TextInput>
                            <Text style={styles.label}>Confirm Password </Text>
                            <TextInput style = {styles.formInput} placeholder="Confirm Password" secureTextEntry={true} onChangeText={(text)=>this.setState({confirmPassword : text})}></TextInput>
                        </View>
                        <View style={{flex : 0.2,alignItems:'center'}}>
                            <TouchableOpacity style={styles.registerButton} onPress={()=>{this.signUp(this.state.emailId,this.state.password,this.state.confirmPassword)}}><Text style={styles.registerButtonText}>Register</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.registerButton} onPress={()=>this.setState({isModalVisible : false})}><Text style={styles.registerButtonText}>Cancel</Text></TouchableOpacity>
                        </View>
                    </ScrollView>
            </Modal>
        );
    }

    render(){
        return(
        <View style={styles.container}>
            {this.showModal()}
           <View style={{flex : 0.25}}>
               <View style={{flex : 0.15}}></View>
               <View style={styles.santaView}>
                   <Image source={require("../assets/santa.png")} style={styles.santaImg}></Image>
               </View>
           </View>
           <View style={{flex:0.45}}>
               <View style={styles.TextInput}>
                <TextInput style={styles.loginBox} placeholder = "youremailaddress@com" placeholderTextColor="gray" keyboardType = "email-address" 
                    onChangeText ={(text)=>this.setState({emailId : text})}/>
                <TextInput style={[styles.loginBox, { marginTop: RFValue(15) }]} placeholder = "Your Password" placeholderTextColor="gray" secureTextEntry={true} 
                    onChangeText ={(text)=>this.setState({password : text})}/>
            </View>
          
           <View style={{ flex: 0.5, alignItems: "center" }}>
                <TouchableOpacity style={styles.button} onPress={()=>this.login(this.state.emailId,this.state.password)}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={()=>this.setState({isModalVisible : true})}>
                    <Text style={styles.buttonText}>SignUp</Text>
                </TouchableOpacity>
            </View>
            </View>
            <View style={{ flex: 0.3 }}>
          <Image
            source={require("../assets/book.png")}
            style={styles.bookImage}
            resizeMode={"stretch"}
          />
        </View>
        </View>);
    }
}

const styles = StyleSheet.create({
    container : {
        flex:1,
        backgroundColor:'#6fc0b8',
    },
    button : {
        width: "80%",
    height: RFValue(50),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "#ffff",
    shadowColor: "#000",
    marginBottom: RFValue(10),
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16

    },
    buttonText: {
        color: "#32867d",
        fontWeight: "200",
        fontSize: RFValue(20)
    },

    label: {
        fontSize: RFValue(13),
        color: "#717D7E",
        fontWeight: "bold",
        paddingLeft: RFValue(10),
        marginLeft: RFValue(20)
      },
      formInput: {
        width: "90%",
        height: RFValue(45),
        padding: RFValue(10),
        borderWidth: 1,
        borderRadius: 2,
        borderColor: "grey",
        paddingBottom: RFValue(10),
        marginLeft: RFValue(20),
        marginBottom: RFValue(14)
      },
    signUpText : {
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#32867d"
    },
    scrollview: {
        flex: 1,
        backgroundColor: "#fff"
      },
      signupView: {
        flex: 0.05,
        justifyContent: "center",
        alignItems: "center"
      },
      santaImage: {
        width: "70%",
        height: "100%",
        resizeMode: "stretch"
      },
      TextInput: {
        flex: 0.5,
        alignItems: "center",
        justifyContent: "center"
      },
      bookImage: {
        width: "100%",
        height: RFValue(220)
      },

      registerButton: {
        width: "75%",
        height: RFValue(50),
        marginTop: RFValue(20),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(3),
        backgroundColor: "#32867d",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: RFValue(10)
      },
      registerButtonText: {
        fontSize: RFValue(23),
        fontWeight: "bold",
        color: "#fff"
      },
      cancelButtonText: {
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#32867d",
        marginTop: RFValue(10)
      },
      loginBox:{
        width: '80%',
        height: RFValue(50),
        borderWidth: 1.5,
        borderColor : '#ffffff',
        fontSize: RFValue(20),
        paddingLeft:RFValue(10)
      },
      santaView: {
        flex: 0.85,
        justifyContent: "center",
        alignItems: "center",
        padding: RFValue(10)
      },
});