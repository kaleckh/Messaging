import MessageListItem from '../components/MessageListItem';
import { useState, useRef, useContext } from 'react';
import { Message, getMessages } from '../data/messages';
import React, { useEffect } from 'react';
import { getMessaging, Messaging } from 'firebase/messaging'
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import {  } from 'firebase';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { colorFill, heart, addOutline, sendOutline, send, backspaceOutline, returnUpBackOutline, heartCircle, addCircleOutline, checkmarkOutline } from "ionicons/icons";
import { Keyboard } from '@capacitor/keyboard';
import { MyContext } from '../providers/postProvider';
const SUPABASE_URL = 'https://verqruktxvesbhtimfjm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt0eHZlc2JodGltZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDM3NTIsImV4cCI6MjAyODg3OTc1Mn0.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg'
import { post } from '../utils';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonRouterLink,
    IonButton,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter,
    IonNavLink,
    IonTextarea
} from '@ionic/react';
import '../themes/newChat.css'
import Home from '../pages/Home';

const Chat = () => {
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<string>();
    const [messages, setMessages] = useState<
        {
            userName: string;
            message: string;
        }[]
    >([]);
    const channel = useRef<RealtimeChannel | null>(null);
    const { myUsername, person, setPerson, getConvos, updateMessages } = useContext(MyContext);
    const [uniqueUsers, setUniqueUsers] = useState();
    const [myConvo, setMyConvo] = useState();
    const [convoId, setConvoId] = useState<string>('');
    const [userName, setUserName] = useState<string | null>(localStorage.getItem('user'))


    useEffect(() => {
        if (userName === '') {
            setUserName(localStorage.getItem('user'))
        }
    }, [userName])

    useEffect(() => {
        if (messages.length === 1) {
            addMessages()
        } else if (messages.length > 1) {
            let users = messages.map((msg) => { return msg.userName })
            let uniq = [...new Set(users)];
            let nameToRemove = localStorage.getItem('user');
            let array = uniq.filter(item => item !== nameToRemove);
            setUniqueUsers(array)
            console.log(array)
            console.log(uniqueUsers)            
            updateMessages(convoId, messages, array)
        }
    }, [messages])


    useEffect(() => {
        if (!channel.current) {
            const client = createClient(
                SUPABASE_URL!,
                SUPABASE_KEY!
            );
            channel.current = client.channel("chat-room", {
                config: {
                    broadcast: {
                        self: true,
                    },
                },
            });
            channel.current
                .on("broadcast", { event: "message" }, ({ payload }) => {
                    setMessages((prev) => [...prev, payload.message]);
                })
                .subscribe();
        }
        return () => {
            channel.current?.unsubscribe();
            channel.current = null;
        };
    }, []);


    function onSend() {
        if (!channel.current || message.trim().length === 0) return;
        channel.current.send({
            type: "broadcast",
            event: "message",
            payload: { message: { message, userName } },
        });
        setMessage("");
    }

    const addMessages = async () => {
        const addMessage = await post({
            url: `http://localhost:3000/api/addMessage`,
            body: {
                messages: messages,
                me: localStorage.getItem('user'),
                users: uniqueUsers?.filter((unq) => unq !== localStorage.getItem('user')),
            },
        });
        setConvoId(addMessage.update.id)
        console.log(addMessage.update, 'this is adding a message')
        getConvos()
    };

    const handleRefresh = () => {
        getConvos()
    }

    // const updateMessages = async (id: string) => {
    //     const addMessage = await post({
    //         url: `http://localhost:3000/api/updateMessages`,
    //         body: {
    //             messages: messages,
    //             me: localStorage.getItem('user'),
    //             id,
    //             users: uniqueUsers?.filter((unq) => unq !== localStorage.getItem('user')),
    //         },
    //     });
    //     handleRefresh()
    // };


    // const getConvos = async () => {
    //     try {
    //         const convos = await fetch(
    //             `http://localhost:3000/api/getConvo?`,
    //             {
    //                 method: "GET",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             },
    //         );
    //         const thisConvo = await convos.json();
    //         setMessages(thisConvo.Posts.message)
    //     } catch (error) {
    //         console.log(error, "this is the create user error");
    //     }
    // };


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <div className='flex'>
                        <IonRouterLink onClick={() => {updateMessages(convoId, messages, uniqueUsers)}} routerLink="/home" routerDirection="back">
                            <IonIcon size='large' icon={returnUpBackOutline}></IonIcon>
                        </IonRouterLink>
                        <div className='centeredInputContainer'>
                            <IonInput className='inputCenter' onIonInput={(e) => { setUserName(e?.target.value) }} type='text' placeholder={userName}></IonInput>
                        </div>
                        <IonButton size='small'></IonButton>
                    </div>
                </IonToolbar>
            </IonHeader>
            <div className='freshPage'>
                <div className="column">
                    {messages?.map((msg, i) => (
                        <div
                            key={i}
                            className={` ${userName === msg.userName ? "end" : "start"}`}
                        >
                            <div className={`${userName === msg.userName ? "centerEnd" : "centerBeginning"}`}>
                                <div className={`${userName === msg.userName ? "blueEnd" : "grayEnd"}`}>
                                    {messages[i - 1]?.userName === msg.userName ? <>{ }</> : <div className='user'>{msg.userName}</div>}

                                </div>
                                <div className={`message ${userName === msg.userName ? "blue" : "gray"
                                    } `}>{msg.message}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="columnWhite">
                    <div className='flex'>
                        <IonTextarea
                            style={{ borderBottom: '1px solid black', width: '90%', height: 'fit-content', backgroundColor: 'white' }}
                            placeholder="Message"
                            value={message}
                            onIonInput={(e) => setMessage(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    onSend();
                                }
                            }}
                            className="something"
                        />
                        <IonButton onClick={() => { onSend() }} size='small'><IonIcon icon={sendOutline}></IonIcon></IonButton>
                    </div>
                </div>
            </div>
        </IonPage>
    );

};

export default Chat;
