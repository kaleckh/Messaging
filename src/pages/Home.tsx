import MessageListItem from "../components/MessageListItem";
import { useState, useRef, useContext } from "react";
import { Message, getMessages } from "../data/messages";
import React, { useEffect } from "react";
import { getMessaging, Messaging } from "firebase/messaging";
import {
  colorFill,
  heart,
  addOutline,
  settingsOutline,
  contractOutline,
} from "ionicons/icons";
// import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import "../themes/chat.css";
import { Keyboard } from "@capacitor/keyboard";
const SUPABASE_URL = "https://verqruktxvesbhtimfjm.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt0eHZlc2JodGltZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDM3NTIsImV4cCI6MjAyODg3OTc1Mn0.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg";
import { post } from "../utils";
import {
  IonContent,
  useIonRouter,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonMenu,
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
  IonItem,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import "./Home.css";
import { MyContext } from "../providers/postProvider";
import { useHistory } from "react-router";
import SwiperCore from "swiper";
import { trash } from "ionicons/icons";
import { Navigation, Pagination, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "../themes/swiper.css";
import "./Home.css";
import { motion, AnimatePresence } from "framer-motion";
import "../themes/test.css";
import "../themes/styles.scss";
import LastMessage from "../components/LastMessage";

SwiperCore.use([Pagination]);
const Home: React.FC = () => {
  const router = useIonRouter();
  const history = useHistory();
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState();
  const [convos, setConvos] = useState([]);
  const [myUsername, setMyUsername] = useState<string>("");
  const { person, setPerson, getConvos, myConvos, deleteConvos } =
    useContext(MyContext);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);

  const DELETE_BTN_WIDTH = 70;

  const MESSAGE_DELETE_ANIMATION = { height: 0, opacity: 0 };
  const MESSAGE_DELETE_TRANSITION = {
    opacity: {
      transition: {
        duration: 0,
      },
    },
  };

  useEffect(() => {
    getConvos();
    const intervalId = setInterval(getConvos, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setVisibleCards(
      myConvos?.map((card) => {
        return true;
      }),
    );
  }, [myConvos]);

  const handleNavigation = () => {
    router.push("/home", "forward");
  };

  function gotoTopic(topicId: String) {
    history.push("/chat/" + topicId);
  }

  const handleSlideChange = (swiper: any, index: number) => {
    if (swiper.activeIndex === 1) {
      console.log(`Slide ${index + 1} is in view`);
      // Run your specific function here
    }
  }

  const handleDragEnd = (info, messageId: string) => {    
    const dragDistance = info.point.x;
    if (dragDistance < -DELETE_BTN_WIDTH) {
      // setMessagesList(messagesList.filter(message => message.id !== messageId))
      deleteConvos(messageId);
    }
  };

  console.log(myConvos, "these are conbos");

  return (
    <>
      <IonMenu contentId="mainContent">
        <IonHeader>
          <IonToolbar>Menu</IonToolbar>
        </IonHeader>
        <div className="centerButton">
          <IonButton>Logout</IonButton>
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
              {myConvos?.map((convo, i) => {
                // Extract and format the local time for the last message date
                // const lastMessageDate = new Date(convo?.message[convo?.message.length - 1].date);
                // let hours = lastMessageDate.getHours();
                // const minutes = String(lastMessageDate.getMinutes()).padStart(2, "0");
                // const seconds = String(lastMessageDate.getSeconds()).padStart(2, "0");
                // const ampm = hours >= 12 ? 'PM' : 'AM';
                // hours = hours % 12 || 12; // Convert to 12-hour format

                // const time = `${hours}:${minutes} ${ampm}`;

                return (
                  <motion.li
                    key={convo.id}
                    exit={MESSAGE_DELETE_ANIMATION}
                    transition={MESSAGE_DELETE_TRANSITION}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => handleDragEnd(info, convo?.id)}
                      className="msg-container"
                    >
                      <img
                        style={{ marginLeft: "10px" }}
                        className="user-icon"
                        src={
                          "https://ionicframework.com/docs/img/demos/avatar.svg"
                        }
                        alt="User icon"
                      />

                      <div
                        onClick={() => gotoTopic(convo?.id)}
                        className="message-text"
                      >
                        <div className="flexTime">
                          <div className="Title">
                            {localStorage.getItem("user") === convo?.me
                              ? convo?.recipient
                              : convo?.me}
                          </div>
                          {/* <div className='graySub'>{time}</div> */}
                        </div>
                        <LastMessage conversationId={convo?.id} />
                      </div>
                    </motion.div>
                    <div className="delete-btn">Delete</div>
                  </motion.li>
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
