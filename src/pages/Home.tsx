import React, { useState, useEffect, useContext } from "react";
import supabase from "../components/supabaseClient";
import { useHistory } from "react-router-dom";
import Test from "./Test";
import {
  useIonRouter,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonMenu,
  IonHeader,
  IonRouterLink,
  IonButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";

import { AnimatePresence } from "framer-motion";

import { MyContext } from "../providers/postProvider";


import "../themes/chat.css";
import "../themes/swiper.css";
import "../themes/test.css";
import "../themes/styles.scss";
import "./Home.css";



interface MessageData {
  conversationId: string;
  date: string; // Use string because date is usually a string from an API
  id: string;
  message: string;
  status: string;
  userName: string;
  recipient?: string;
}

const Home: React.FC = () => {

  const [messageData, setMessageData] = useState<MessageData[]>([]);
  const { getConvos, myConvos } = useContext(MyContext);
  const history = useHistory();

  useEffect(() => {
    getConvos();
    const intervalId = setInterval(getConvos, 1000);
    return () => clearInterval(intervalId);
  }, []);


  const getConvoData = async () => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/getConvoData?ids=${myConvos?.map((convo: { id: string }) => convo.id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const allData = await result.json();
      setMessageData(allData.Posts);
    } catch (error) {
      console.log(error, "this is an error");
    }
  };


  useEffect(() => {
    getConvoData();
  }, [myConvos]);


  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const gotoTopic = () => {
    history.push("/login");
  };



  return (
    <>
      <IonMenu contentId="mainContent">
        <IonHeader>
          <IonToolbar>Menu</IonToolbar>
        </IonHeader>
        <div className="centerButton">
          <IonButton onClick={() => {
            handleLogout(); localStorage.removeItem('user'); gotoTopic()
          }}>Logout</IonButton>
        </div>
      </IonMenu>
      <IonPage>
        <IonHeader>
          <IonToolbar class="ion-text-center">
            <IonButtons id="mainContent" slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>{localStorage.getItem("user")}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <ul>
            <AnimatePresence>
              {messageData?.map((convo, i) => {
                const lastMessageDate = new Date(convo.date);
                let hours = lastMessageDate.getHours();
                const minutes = String(lastMessageDate.getMinutes()).padStart(
                  2,
                  "0",
                );
                const ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12; // Convert to 12-hour format
                const time = `${hours}:${minutes} ${ampm}`;

                return (
                  <Test key={convo.conversationId} time={time} conversationId={convo.conversationId} message={convo.message} status={convo.status} userName={convo.userName} recipient={convo.recipient} />
                );
              })}
            </AnimatePresence>
          </ul>
          <div className="center">
            <div>Create A Conversation</div>
            <IonRouterLink routerLink="/newChat" routerDirection="forward">
              <IonIcon size="large" icon={addOutline}></IonIcon>
            </IonRouterLink>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;
