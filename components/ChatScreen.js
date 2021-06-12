import styled from "styled-components";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth,db} from "../firebase";
import {useRouter} from "next/router";
import {Avatar,IconButton} from "@material-ui/core";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {useCollection} from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import { useRef,useState } from "react";
import firebase from "firebase";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function ChatScreen({chat,messages}){
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [input,setInput] = useState("");
    const endOfMsgRef = useRef(null);
    const [messageSnapshot] = useCollection(db.collection("chats").doc(router.query.id).collection("messages").orderBy("timestamp","asc"));
    const [recipientSnapshot] = useCollection(db.collection("users").where("email","==",getRecipientEmail(chat.users,user)));
    const showMessages = () => {
        if(messageSnapshot){
            return messageSnapshot.docs.map(message => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ));
        }else {
            return JSON.parse(messages).map((message)=> (
                <Message  key={message.id} user={message.user} message={message} />
            ));
        }
    };
    const scrollToBottom = () => {
        endOfMsgRef.current.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });
    };
    const sendMessage = (e) => {//e means event
        e.preventDefault();
        //console.log("u have submitted info");
        //console.log(e.target.value);
        //update the last seen
        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        },{merge:true});

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user : user.email, 
            photoURL: user.photoURL
        });
        setInput("");
        scrollToBottom();
    };
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users,user);
    return (<Container>
        <Header>
            {recipient ? 
                (<Avatar src={recipient?.photoURL} alt=""/>) : 
                (<Avatar >{recipientEmail[0]}</Avatar>)
            }
            
            <HeaderInformation >
                <h3>{recipientEmail}</h3>
                {recipientSnapshot ? (
                    <p>Last Active : {' '}
                    {recipient?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                    ): "Unavailable"}</p>
                ):(
                    <p>Loading Last Active...</p>
                )}
                
            </HeaderInformation>
            <HeaderIcons>
                <IconButton>
                    <AttachFileIcon/>
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </HeaderIcons>
        </Header>
        <MessageContainer>
        {showMessages()}
            <EndOfMsg ref={endOfMsgRef}/>
        </MessageContainer>
        <InputContainer>
            <InsertEmoticonIcon />
            <Input value={input} onChange={e => setInput(e.target.value)}/>
            <button hidden disabled={!input} type="submit" onClick={sendMessage}>
                Send Message
            </button>
            <MicIcon />
        </InputContainer>
    </Container>);
}
export default ChatScreen;
const Container = styled.div``;
const Input = styled.input`
    flex:1;
    outline:0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    margin-left: 15px;
    margin-right: 15px;
    padding: 20px;
`;
const Header = styled.div`
    display: flex;
    background-color:white;
    top: 0;
    z-index:100;
    padding:11px;
    position:sticky;
    height:80px;
    align-items:center;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
    flex:1;
    margin-left: 15px;
    > h3{
        margin-bottom: 3px;
    }
    > p{
        font-size:14px;
        color:gray;
    }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;
const EndOfMsg = styled.div`
    margin-bottom: 50px;
`;
const InputContainer = styled.form`
    display: flex;
    bottom: 0;
    padding: 10px;
    background-color: white;
    position: sticky;
    align-items: center;
    z-index:100;
`;