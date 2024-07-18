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
import { chevronForwardOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { MyContext } from "../providers/postProvider";

import "../themes/chat.css";
import "../themes/swiper.css";
import "../themes/test.css";
import "../themes/styles.scss";
import "./Home.css";

interface TestProps {
  conversationId: string;
  message: string;
  status: string;
  userName: string;
  recipient?: string;
  time: string;
}

const Test = (props: TestProps) => {
  const history = useHistory();
  const { getConvos, deleteConvos, myUsername } = useContext(MyContext);
  const DELETE_BTN_WIDTH = 15;
  const MESSAGE_DELETE_ANIMATION = { height: 0, opacity: 0 };
  const MESSAGE_DELETE_TRANSITION = {
    opacity: {
      transition: {
        duration: 0,
      },
    },
  };

  const gotoTopic = (topicId: string) => {
    history.push("/chat/" + topicId);
  };

  const handleDragEnd = (info: any, messageId: string) => {
    console.log('hit drag end')
    const dragDistance = info.point.x;    
    console.log(dragDistance, 'testing drag end truthy')
    console.log(-DELETE_BTN_WIDTH, 'testing drag end truthy')
    if (dragDistance < DELETE_BTN_WIDTH) {      
      console.log('drag distance is right')
      deleteConvos(messageId);
    }
  };

  return (
    <motion.li
      key={props.id}
      exit={MESSAGE_DELETE_ANIMATION}
      transition={MESSAGE_DELETE_TRANSITION}
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(_, info) => handleDragEnd(info, props.conversationId)}
        className="msg-container"
      >
        <div>
          {props.status === "Delivered" && props.userName !== myUsername ? (
            <div className="blueDot"></div>
          ) : (
            <div className="blueDotNothing"></div>
          )}
        </div>
        <img
          style={{ marginLeft: "10px" }}
          className="user-icon"
          src={"https://ionicframework.com/docs/img/demos/avatar.svg"}
          alt="User icon"
        />
        <div
          onClick={() => gotoTopic(props.conversationId)}
          className="message-text"
        >
          <div className="flexTime">
            <div style={{ width: "63%" }} className="Title">
              {props.recipient === myUsername ? (
                <>{props.userName}</>
              ) : (
                <>{props.recipient}</>
              )}
            </div>
            <div className="graySub">{props.time}</div>
            <IonIcon size="small" icon={chevronForwardOutline}></IonIcon>
          </div>
          <div className="smallGray">{props.message}</div>
        </div>
      </motion.div>
      <div className="delete-btn">Delete</div>
    </motion.li>
  );
};

export default Test;
