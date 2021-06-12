import styled from "styled-components";
import {Avatar} from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth , db} from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";

function Chat({id,users}){
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [RecipientSnapshot] = useCollection(db.collection('users').where('email','==',getRecipientEmail(users,user)));
    const recipientEmail = getRecipientEmail(users,user);
    const recipient = RecipientSnapshot?.docs?.[0]?.data();
    const enterChat = () => {
        router.push(`/chat/${id}`)
    }
    return(
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ) :
            (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            
            <p>{recipientEmail}</p>
        </Container>
    );
}
export default Chat;
const Container = styled.div`
    display: flex;
    padding: 15px;
    cursor: pointer;
    align-items: center;
    word-break: break-word;

    :hover{
        background-color: #e9eaeb;
    }
`;
const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right: 15px;
`;