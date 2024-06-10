import MessageListItem from '../components/MessageListItem';
import { useState, useRef, useContext } from 'react';
import { Message, getMessages } from '../data/messages';
import React, { useEffect } from 'react';
import { getMessaging, Messaging } from 'firebase/messaging'
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import {  } from 'firebase';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import { colorFill, heart, addOutline, sendOutline, send, backspaceOutline, returnUpBackOutline, heartCircle } from "ionicons/icons";
import '../themes/chat.css'
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
import '../themes/chat.css';
import Home from '../pages/Home';

const ChatBox = ({ id }: { id: string }) => {
    const [message, setMessage] = useState<string>("");
    const [user, setUser] = useState<string>();
    const [messages, setMessages] = useState<
        {
            userName: string;
            message: string;
        }[]
    >([]);
    const channel = useRef<RealtimeChannel | null>(null);
    const { myUsername, person, setPerson } = useContext(MyContext);
    const [uniqueUsers, setUniqueUsers] = useState();
    const [myConvo, setMyConvo] = useState();
    const [userName, setUserName] = useState<string | null>(localStorage.getItem('user'))


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


    useEffect(() => {
        let users = messages.map((msg) => { return msg.userName })
        let uniq = [...new Set(users)];
        setUniqueUsers(uniq)
    }, [messages])

    useEffect(() => {

        getConvos()
    }, [])

    function onSend() {
        if (!channel.current || message.trim().length === 0) return;
        channel.current.send({
            type: "broadcast",
            event: "message",
            payload: { message: { message, userName } },
        });
        setMessage("");
    }

    const updateMessages = async () => {
        const addMessage = await post({
            url: `http://localhost:3000/api/addMessage`,
            body: {
                messages: messages,
                me: localStorage.getItem('user'),
                users: uniqueUsers?.filter((unq) => unq !== localStorage.getItem('user')),
            },
        });
        console.log(addMessage, 'add it')
    };


    const getConvos = async () => {
        try {
            const convos = await fetch(
                `http://localhost:3000/api/getConvo?id=${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const thisConvo = await convos.json();
            setMessages(thisConvo.Posts.message)            
        } catch (error) {
            console.log(error, "this is the create user error");
        }
    };


    console.log(id, 'this is the id`')

    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <div className='flex'>
                        <IonNavLink routerDirection="forward" component={() => <Home />}>
                            <IonIcon size='large' icon={returnUpBackOutline}></IonIcon>
                        </IonNavLink>
                        <IonInput onIonInput={(e) => { setUserName(e?.target.value) }} type='text' placeholder={userName}></IonInput>
                    </div>
                </IonToolbar>
            </IonHeader>
            <div className='page'>
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
                                    // updateMessages()
                                }
                            }}
                            className="something"
                        />
                        <IonButton onClick={() => { onSend() }} size='small'><IonIcon icon={sendOutline}></IonIcon></IonButton>                        
                    </div>
                </div>
            </div>
        </>
    );

};

export default ChatBox;
