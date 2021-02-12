import * as React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {ListItem,Icon} from 'react-native-elements';
import MyHeader from '../component/MyHeader';




export default class MyDonationsScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            allDonations : [],
            donorId : firebase.auth().currentUser.email,
            donorName : ''
        }

        this.donateRef = null;
    }

    getAllDonations(){
        this.donateRef = db.collection("all_donations").where("donorId","==",this.state.donorId)
        .onSnapshot(snapshot=>{
            let allDonations =[];
            snapshot.docs.map((doc)=>{
                var donation = doc.data()
            donation["doc_id"] = doc.id
            allDonations.push(donation)});
                this.setState({
                    allDonations : allDonations
                })
            })
    }

    getDonorDetails(){
        db.collection("users").where("emailId","==",this.state.donorId).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    donorName : doc.data().firstName + " " + doc.data().lastName
                })
            });
        })
    }

    sendBook(bookDetails){
        console.log(bookDetails);
        if(bookDetails.requestStatus == "Book Sent"){
            var status = "Donor Interested";

            db.collection("all_donations").doc(bookDetails.doc_id).update({
                requestStatus : status
            })

            
            this.sendNotifications(bookDetails,status);
        }
        else{
            var status = "Book Sent";

            db.collection("all_donations").doc(bookDetails.doc_id).update({
                requestStatus : status
            })
            
            this.sendNotifications(bookDetails,status);
        }
    }

    sendNotifications(bookDetails,requestStatus){
        var requestID = bookDetails.requestId;
        var donorID = this.state.donorId;

        db.collection("all_notifications").where("requestId","==",requestID).get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                var message = ""
                if(requestStatus == "Donor Interested"){
                    message =  this.state.donorName  + " has shown interest in donating the book";
                }
                else{
                    message =  this.state.donorName  + " has sent you a book"
                }
                db.collection("all_notifications").doc(doc.id).update({
                    "message": message,
                    "notificationStatus" : "unread",
                    "date"                : firebase.firestore.FieldValue.serverTimestamp()
                  })
            })
        })
    }
    
    keyExtractor = (item,index) => index.toString()

    renderItem = ({item,index})=>(
        <ListItem
        key={index}
        title={item.bookName}
        subtitle = {"Requested By " + item.requestedBy + "\nStatus " + item.requestStatus}
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
        titleStyle={{ color: 'black', fontWeight: 'bold' }}
        rightElement={
            <TouchableOpacity style={[styles.button,{
                backgroundColor:
                  item.requestStatus === "Book Sent" ? "green" : "#ff5722",
              },]} onPress={()=>{
                this.sendBook(item);
            }}>
              <Text style={{ color: "#ffff" }}>
            {item.requestStatus === "Book Sent" ? "Book Sent" : "Send Book"}
          </Text>
            </TouchableOpacity>
          }
        bottomDivider
        ></ListItem>
    )

    componentDidMount(){
        this.getAllDonations();
        this.getDonorDetails();
    }

    componentWillUnmount(){
        this.donateRef();
    }


    render(){
        return(<View style={{flex:1}}>
            
            <MyHeader title="My Donations" navigation={this.props.navigation}></MyHeader>
           
                <View style={{flex : 1}}>
                    { 
                    this.state.allDonations.length === 0?
                   
                    ( <View style={styles.subtitle}>
                        <Text style={{fontSize : 20}}>List of all Donations</Text>
                        </View>
                    )
                    :
                    (<FlatList
                    keyExtractor = {this.keyExtractor}
                    data = {this.state.allDonations}
                    renderItem = {this.renderItem}>
                    </FlatList>)
                    }
                </View>
            </View>);
    }
}

const styles=StyleSheet.create({
    button: {
        width: 100,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        elevation: 16,
      },
      subtitle: {
        flex: 1,
        fontSize: 20,
        justifyContent: "center",
        alignItems: "center",
      },
});