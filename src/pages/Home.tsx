import MessageListItem from '../components/MessageListItem';
import { useState, useRef, useContext } from 'react';
import { Message, getMessages } from '../data/messages';
import React, { useEffect } from 'react';
import { getMessaging, Messaging } from 'firebase/messaging'
import { colorFill, heart, addOutline, settingsOutline, contractOutline } from "ionicons/icons";
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// import {  } from 'firebase';
import { createClient, RealtimeChannel } from '@supabase/supabase-js'

import '../themes/chat.css'
import { Keyboard } from '@capacitor/keyboard';
const SUPABASE_URL = 'https://verqruktxvesbhtimfjm.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt0eHZlc2JodGltZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDM3NTIsImV4cCI6MjAyODg3OTc1Mn0.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg'
import { post } from '../utils';


import {
  IonContent,
  useIonRouter,
  IonIcon,
  IonCard,
  IonHeader,
  IonInput,
  IonCardTitle,
  IonRouterLink,
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
import { MyContext } from '../providers/postProvider';
import { useHistory } from 'react-router';

const Home: React.FC = () => {
  const router = useIonRouter();
  const history = useHistory();
  const [messages, setMessages] = useState([])
  const [convos, setConvos] = useState([])
  const [myUsername, setMyUsername] = useState<string>('')
  const { person, setPerson, getConvos, myConvos, deleteConvos } = useContext(MyContext);


  useEffect(() => {
    getConvos()
  }, [])

  const handleNavigation = () => {
    router.push('/home', 'forward');
  };

  function gotoTopic(topicId: String) {
    history.push("/chat/" + topicId);
  }


  // console.log(myConvos[0].message, 'these are my convos')
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
          <IonList>
            {myConvos ? <>{myConvos?.map((convo, i) => {
              return (<>
                <IonCard key={i}>
                  <div className='flexSpace'>
                    <IonCardHeader onClick={() => { gotoTopic(convo?.id) }}>
                      <IonCardTitle>{convo?.users.join(', ')}</IonCardTitle>
                    </IonCardHeader>
                    <div onClick={() => {
                      deleteConvos(convo?.id)
                    }}>X</div>
                  </div>
                  <IonCardContent>{convo?.message[convo?.message?.length - 1]?.message}</IonCardContent>
                </IonCard>
              </>)
            })}</> :
              <><div>Write a message</div></>}
          </IonList>
          <div className='center'>
            <div>Create A Conversation</div>
            <IonRouterLink routerLink="/newChat" routerDirection="forward">
              <IonIcon size='large' icon={addOutline}></IonIcon>
            </IonRouterLink>
          </div>
          {/* <IonButton onClick={() => { getConvos() }}>Get Convos</IonButton> */}
        </IonContent>
      </IonPage>
    </>
  );

};

export default Home;
