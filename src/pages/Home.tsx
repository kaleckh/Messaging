import React, { useState, useEffect, useContext } from "react";
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
import { addOutline, chevronForwardOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pagination } from "swiper/modules";
import { MyContext } from "../providers/postProvider";
import SwiperCore from "swiper";
import LastMessage from "../components/LastMessage";

import "../themes/chat.css";
import "../themes/swiper.css";
import "../themes/test.css";
import "../themes/styles.scss";
import "./Home.css";

// Supabase constants
const SUPABASE_URL = "https://verqruktxvesbhtimfjm.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt0eHZlc2JodGltZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDM3NTIsImV4cCI6MjAyODg3OTc1Mn0.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg";

// Swiper modules setup
SwiperCore.use([Pagination]);

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
  const router = useIonRouter();
  const history = useHistory();
  const [messageData, setMessageData] = useState<MessageData[]>([]);
  const { person, setPerson, getConvos, myConvos, deleteConvos, myUsername } =
    useContext(MyContext);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [lastUser, setLastUser] = useState<string>();
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
    setVisibleCards(myConvos?.map(() => true));
  }, [myConvos]);

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
      console.log(allData.Posts, "this is the response");
      setMessageData(allData.Posts);
    } catch (error) {
      console.log(error, "this is an error");
    }
  };

  const handleNavigation = () => {
    router.push("/home", "forward");
  };

  const gotoTopic = (topicId: string) => {
    history.push("/chat/" + topicId);
  };

  const handleSlideChange = (swiper: any, index: number) => {
    if (swiper.activeIndex === 1) {
      console.log(`Slide ${index + 1} is in view`);
      // Run your specific function here
    }
  };

  const handleDragEnd = (info: any, messageId: string) => {
    const dragDistance = info.point.x;
    if (dragDistance < -DELETE_BTN_WIDTH) {
      deleteConvos(messageId);
    }
  };

  useEffect(() => {
    getConvoData();
  }, [myConvos]);

  console.log(messageData, "this is all the message data");
  console.log(myConvos, "this is my convos");

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
                  <motion.li
                    key={convo.id}
                    exit={MESSAGE_DELETE_ANIMATION}
                    transition={MESSAGE_DELETE_TRANSITION}
                  >
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => handleDragEnd(info, convo.id)}
                      className="msg-container"
                    >
                      <div>
                        {convo.status === "Delivered" &&
                        convo.userName !== myUsername ? (
                          <div className="blueDot"></div>
                        ) : (
                          <div className="blueDotNothing"></div>
                        )}
                      </div>
                      <img
                        style={{ marginLeft: "10px" }}
                        className="user-icon"
                        src={
                          "https://ionicframework.com/docs/img/demos/avatar.svg"
                        }
                        alt="User icon"
                      />
                      <div
                        onClick={() => gotoTopic(convo.conversationId)}
                        className="message-text"
                      >
                        <div className="flexTime">
                          <div style={{ width: "63%" }} className="Title">
                            {convo.recipient === myUsername ? (
                              <>{convo.userName}</>
                            ) : (
                              <>{convo.recipient}</>
                            )}
                          </div>
                          <div className="graySub">{time}</div>
                          <IonIcon
                            size="small"
                            icon={chevronForwardOutline}
                          ></IonIcon>
                        </div>
                        <div className="smallGray">{convo.message}</div>
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
