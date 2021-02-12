import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Image} from 'react-native';

import {Card, Header, Icon} from 'react-native-elements';

import firebase from  'firebase';
import db from '../config';
import { RFValue } from 'react-native-responsive-fontsize';



export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            receiverEmailId : this.props.navigation.getParam("details")["userId"],
            userId : firebase.auth().currentUser.email,
            userName : '',
            bookName : this.props.navigation.getParam("details")["bookName"],
            reasonToRequest : this.props.navigation.getParam("details")["reasonToRequest"],
            requestId : this.props.navigation.getParam("details")["requestId"],
            receiverName : '',
            receiverContact : '',
            receiverAddress : '',
            bookImage: "#",
            // receiverRequestDocId : ''
        }
    }

    getReceiverDetails(){
        db.collection("users").where("emailId",'==',this.state.receiverEmailId).get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverName : doc.data().firstName,
                    receiverContact : doc.data().contact,
                    receiverAddress : doc.data().address
                });
            })
            
        })


        db.collection("requested_books")
        .where("requestId", "==", this.state.requestId)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
              console.log(doc.data().image_link)
            this.setState({
              bookImage: doc.data().image_link,
            });
          });
        });
    }

    componentDidMount(){
        this.getReceiverDetails();
        this.getUserDetails();
    }

    updateBookStatus(){
        db.collection("all_donations").add({
            bookName : this.state.bookName,
            requestedBy : this.state.receiverName,
            requestId : this.state.requestId,
            donorId: this.state.userId,
            requestStatus : "Donor Interested"
        });
    }

    addNotification(){
        var message = this.state.userId + " has shown interest in donating the book";
        db.collection("all_notifications").add({
            targetUserId : this.state.receiverEmailId,
            donorId : this.state.userId,
            requestId : this.state.requestId,
            bookName : this.state.bookName,
            date: firebase.firestore.FieldValue.serverTimestamp(),
            notificationStatus : "unread",
            message : message
        })

    }

    getUserDetails(){
        db.collection("users").where("emailId","==",this.state.userId).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    userName : doc.data().firstName + " " + doc.data().lastName
                })
            })
        })
    }


    render(){
        return(
          
        <View style={{flex : 1}}>
            <View style={{flex:0.1}}>
            <Header
            leftComponent ={<Icon name='arrow-left' type='feather' color='#ffffff'  onPress={() => this.props.navigation.goBack()}/>}
            centerComponent={{ text:"Receiver Details", style: { color: '#ffffff', fontSize:RFValue(20),fontWeight:"bold", } }}
            backgroundColor = "#32867d"
          />
          
            </View>
            <View style={{ flex: 0.9 }}>
          <View
            style={{
              flex: 0.3,
              flexDirection: "row",
              paddingTop: RFValue(30),
              paddingLeft: RFValue(10),
            }}
          >
            <View style={{ flex: 0.4,}}>
              <Image
                source={{ uri: this.state.bookImage }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View
              style={{
                flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: RFValue(25),
                  textAlign: "center",
                }}
              >
                {this.state.bookName}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                {this.state.reasonToRequest}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              padding: RFValue(20),
            }}
          >
            <View style={{ flex: 0.7 ,justifyContent:'center',alignItems:'center',marginTop:RFValue(50),borderWidth:1,borderColor:'#deeedd',padding:RFValue(10)}}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: RFValue(30),
                }}
              >
                Receiver Information
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Name : {this.state.receiverName}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Contact: {this.state.receiverContact}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Address: {this.state.receiverAddress}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            > 
              {this.state.receiverEmailId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateBookStatus();
                    this.addNotification();
                    this.props.navigation.navigate("MyDonations");
                  }}
                >
                  <Text style={styles.buttonText}>I want to Donate</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
        </View>
       );
    }
}


const styles = StyleSheet.create({
    button : {
        width:"75%",
        height:RFValue(60),
        justifyContent:'center',
        alignItems:'center',
        borderRadius:RFValue(60),
        backgroundColor:"#32867d",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        marginBottom : 20

},
buttonText : {
    fontWeight:'200',
    fontSize:RFValue(20),
},
});