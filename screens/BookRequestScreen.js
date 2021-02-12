import * as React from 'react';
import {View,TouchableHighlight,Text,TouchableOpacity,Alert,StyleSheet,FlatList,Image} from 'react-native';
import MyHeader from '../component/MyHeader';
import db from '../config';
import firebase from 'firebase';


import {BookSearch} from 'react-native-google-books';
import {Icon,Input} from 'react-native-elements';

import {RFValue} from 'react-native-responsive-fontsize';

export default class BookRequestScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            bookName : '',
            reason : '',
            IsBookRequestActive : '',
            requestedBookName : '',
            bookStatus : '',
            requestId : '',
            userDocId : '',
            docId : '',
            dataSource:"",
            showFlatlist: false
        }

        this.bookReqRef = null;
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    addBookRequest = async (bkName, reasonToRequest)=>{
        var userId = this.state.userId;
        var uniqueRequestId = this.createUniqueId();

        var books = await BookSearch.searchbook(bkName,'AIzaSyAFU6deTvTuMvu1m5elgLFMwitryaHrAJ0');


        db.collection("requested_books").add({
            userId : userId,
            requestId : uniqueRequestId,
            bookName : bkName,
            reasonToRequest : reasonToRequest,
            bookStatus : "requested",
            date : firebase.firestore.FieldValue.serverTimestamp(),
            image_link: books.data[0].volumeInfo.imageLinks.thumbnail
        })

        await this.getBookRequest();

        db.collection("users").where("emailId","==",userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id)
                .update({IsBookRequestActive:true})
            })
        })
        
        this.setState({
            bookName : '',
            reason : '',
            requestId : uniqueRequestId,
        })

        return Alert.alert("Book requested successfully");
    }


    receivedBooks = async()=>{

      var books = await BookSearch.searchbook(this.state.requestedBookName,'AIzaSyAFU6deTvTuMvu1m5elgLFMwitryaHrAJ0');

        db.collection("received_books").add({
            userId : this.state.userId,
            requestId : this.state.requestId,
            bookName : this.state.requestedBookName,
            bookStatus : "received",
            image_link : books.data[0].volumeInfo.imageLinks.thumbnail
        })
    }

    getIsBookRequestActive(){
        this.bookReqRef = db.collection("users").where("emailId","==",this.state.userId)
        .onSnapshot(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    IsBookRequestActive:doc.data().IsBookRequestActive,
                    userDocId : doc.id
                })
            })
        })
    }

    async componentDidMount(){
        this.getIsBookRequestActive();
        this.getBookRequest();
    }

    componentWillUnmount(){
        this.bookReqRef();
    }

    getBooksFromApi=async(bookName)=>{
        this.setState({
            bookName : bookName
        })
        if(bookName.length>2){
            var books = await BookSearch.searchbook(bookName,'AIzaSyAFU6deTvTuMvu1m5elgLFMwitryaHrAJ0');

            this.setState({
                dataSource : books.data,
                showFlatlist : true,
                
            })

        
            // console.log("here is the book data volume " ,books.data[0].volumeInfo.title);
            // console.log("this is the self link ",books.data[0].selfLink);
            // console.log("this is the sale",books.data[0].saleInfo.buyLink);
            // console.log("this is imagelink",books.data[0].imageLinks);
        }
    }

    sendNotification=()=>{
        db.collection("users").where("emailId","==",this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name = doc.data().firstName;
                var lname = doc.data().lastName;

                db.collection("all_notfications").where("requestId","==",this.state.requestId).get()
                .then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorId = doc.data().donorId;
                        var bname = doc.data().bookName;

                        db.collection("all_notifications").add({
                            targetUserId : donorId,
                            message : name + " " + lname + " received the book " + this.state.requestedBookName,
                            bookName : this.state.requestedBookName,
                            date : firebase.firestore.FieldValue.serverTimestamp(),
                            notificationStatus : "unread",
                            requestId : this.state.requestId
                        })
                    })
                })
            })
        })
    }

    updateBookRequestStatus=()=>{
        db.collection("requested_books").doc(this.state.docId)
        .update({
            bookStatus : "received"
        })

        db.collection("users").where("emailId","==",this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id)
                .update({
                    IsBookRequestActive : false
                })
            })
        })
    }

    getBookRequest =()=>{
        db.collection("requested_books")
        .where("userId","==",this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().bookStatus != "received"){
                    this.setState({
                        requestId : doc.data().requestId,
                        requestedBookName : doc.data().bookName,
                        bookStatus : doc.data().bookStatus,
                        requestedImageLink: doc.data().image_link,
                        docId : doc.id
                    })
                 }
            })
        })
    }


    //render Items  functionto render the books from api
 renderItem = ( {item, i} ) =>{
   
 
 
    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={()=>{
            this.setState({
            showFlatlist:false,
            bookName:item.volumeInfo.title,
            })}
        }
       bottomDivider
       >
        {/* Touchable Highlight can have one child..if more child, needed, wrap it in View */}
        <View style={{flexDirection:'row'}}>
           <Icon name="search" type="font-awesome" color="#696969"/>
            <Text> {item.volumeInfo.title} </Text>
        </View>
      </TouchableHighlight>
 
 
    )
  }
    
    render(){
        if(this.state.IsBookRequestActive){
            return(

                // Status screen
                <View style={{flex:1}}>
                    <View style={{flex: 0.1}}>
                        <MyHeader title="Requested Book Status" navigation={this.props.navigation}></MyHeader>
                    </View>
                    <View style={styles.ImageView}>
                        <Image
                        source={{ uri: this.state.requestedImageLink }}
                        style={styles.imageStyle}
                        />
                    </View>
                    <View style={styles.bookstatus}>
            <Text style={{fontSize: RFValue(25), fontWeight: "bold",}}>
              Name of the book
            </Text>
            <Text style={styles.requestedbookName}>
              {this.state.requestedBookName}
            </Text>
            <Text style={styles.status}>
              Status
            </Text>
            <Text style={styles.bookStatus}>
              {"Book Requested"}
            </Text>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updateBookRequestStatus();
                this.receivedBooks(this.state.requestedBookName);
              }}
            >
              <Text style={styles.buttontxt}>
                Book Received
              </Text>
            </TouchableOpacity>
          </View>
        </View>
            )
        }
        else{
            return(<View style={{flex:1}}>
                 <View style={{ flex: 0.1 }}>
                    <MyHeader title="Request a Book" navigation={this.props.navigation}></MyHeader>
                </View>
                <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput}
            label={"Book Name"}
            placeholder={"Book name"}
            containerStyle={{ marginTop: RFValue(60) }}
            onChangeText={(text) => this.getBooksFromApi(text)}
            onClear={(text) => this.getBooksFromApi("")}
            value={this.state.bookName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
            //   enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline
                numberOfLines={8}
                label={"Reason"}
                placeholder={"Why do you need the book"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addBookRequest(
                    this.state.bookName,
                    this.state.reasonToRequest
                  );
                }}
              >
                <Text style={styles.requestbuttontxt}>
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>);
        }
    }
}


const styles = StyleSheet.create({
      
    keyBoardStyle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      formTextInput: {
        width: "75%",
         //Do not give height when you use multiline text input.
       // height : 40,
        height: RFValue(35),
        //If you want the typed text to appear at the top for multiline text box
      // textAlignVertical : 'top',
        borderWidth: 1,
        padding: 10,
      },
      ImageView:{
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center",
        marginTop:20
      },
      imageStyle:{
        height: RFValue(150),
        width: RFValue(150),
        alignSelf: "center",
        borderWidth: 5,
        borderRadius: RFValue(10),
      },
      bookstatus:{
        flex: 0.4,
        alignItems: "center",
    
      },
      requestedbookName:{
        fontSize: RFValue(20),
        padding: RFValue(10),
        alignItems:'center',
        marginLeft:RFValue(10)
      },
      status:{
        fontSize: RFValue(25),
        fontWeight : 'bold',
        marginTop: RFValue(30),
      },
      bookStatus:{
        fontSize: RFValue(20),
        marginTop: RFValue(10),
      },
      buttonView:{
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center",
      },
      buttontxt:{
        fontSize: RFValue(18),
        fontWeight: "bold",
        color: "#fff",
      },
      touchableopacity:{
        alignItems: "flex-start",
        backgroundColor: "#DDDDDD",
        padding: 10,
        width: "90%",
      },
      requestbuttontxt:{
        fontSize: RFValue(20),
        fontWeight: "bold",
        color: "#fff",
      },
      button: {
        width: "75%",
        height: RFValue(60),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(50),
        backgroundColor: "#32867d",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
      },
})