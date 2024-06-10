import MessageListItem from '../components/MessageListItem';
import { useState, useRef } from 'react';
import { Message, getMessages } from '../data/messages';
import React, { useEffect } from 'react';
import { getMessaging, Messaging } from 'firebase/messaging'
import { colorFill, heart, addOutline, settingsOutline, contractOutline } from "ionicons/icons";
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import {  } from 'firebase';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'
import ChatBox from '../components/ChatBox';
import '../themes/chat.css'
import { Keyboard } from '@capacitor/keyboard';
const SUPABASE_URL = 'https://verqruktxvesbhtimfjm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt0eHZlc2JodGltZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDM3NTIsImV4cCI6MjAyODg3OTc1Mn0.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg'
import { post } from '../utils';

import {
  IonContent,
  IonIcon,
  IonCard,
  IonHeader,
  IonInput,
  IonCardTitle,
  IonButton,
  IonCardContent,
  IonNavLink,
  IonList,
  IonFabList,
  IonPage,
  IonRefresher,
  IonCardHeader,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonFab,
  IonFabButton
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  const [messages, setMessages] = useState([])
  const [convos, setConvos] = useState([])
  const [myUsername, setMyUsername] = useState<string>('')


  useEffect(() => {
    console.log(myUsername, 'my Username')
  }, [myUsername])



  const getConvos = async () => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/getConvos?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await convos.json();
      setConvos(userInfo.Posts)
      console.log(userInfo.Posts, "this is convo response");
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };


  console.log(convos, 'these are my convos')
  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar class='ion-text-center'>
            <IonTitle>{localStorage.getItem('user')}</IonTitle>
          </IonToolbar>
          <IonFab horizontal='end' vertical='top'>
            <IonFabButton size='small'>
              <IonIcon size='small' name="add"></IonIcon>
            </IonFabButton>
            <IonFabList side='bottom'>
              <IonFabButton>Logout</IonFabButton>
            </IonFabList>
          </IonFab>
        </IonHeader>
        <IonContent>
          {/* <div className='space'>
            {convos.map((convo) =>
              
            )}
          </div> */}
          <IonList>
            {convos ? <>{convos.map((convo) => {
              return (<>
                <IonCard>
                  <IonNavLink routerDirection="forward" component={() => <ChatBox id={convo?.id} />} >
                    <IonCardHeader>
                      <IonCardTitle>{convo.users[0]}</IonCardTitle>
                    </IonCardHeader>
                  </IonNavLink>
                  <IonCardContent>{convo.message[6].message}</IonCardContent>
                </IonCard>
              </>)
            })}</> :
              <><div>Write a message</div></>}
          </IonList>
          <div className='center'>
            <div>Create A Conversation</div>
            <IonNavLink routerDirection="forward" component={() => <ChatBox id={''} />}>
              <IonIcon size='large' icon={addOutline}></IonIcon>
            </IonNavLink>
          </div>
          <IonButton onClick={() => { getConvos() }}>Get Convos</IonButton>
        </IonContent>
      </IonPage>
    </>
  );

};

export default Home;
