import { IonItem, IonLabel, IonNote } from "@ionic/react";
import { useEffect, useState } from "react";
import { Message } from "../data/messages";
import "./MessageListItem.css";

const LastMessage = ({ conversationId, setStatus, setLastUser }: { conversationId: "", setStatus: (status: string) => {}, setLastUser: (username: string) => {} }) => {
  const [lastMessage, setLastMessage] = useState();

  const getLastMessage = async (conversationId: string) => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/getLastMessage?conversationId=${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await convos.json();
      console.log(userInfo, "this is user info");
      setLastMessage(userInfo.Response[userInfo.Response.length - 1].message);
      setStatus(userInfo.Response[userInfo.Response.length - 1].status);
      setLastUser(userInfo.Response[userInfo.Response.length - 1].userName)
      return userInfo.Response[0].message;
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };


  useEffect(() => {
    if (conversationId) {
      getLastMessage(conversationId);
      const intervalId = setInterval(() => getLastMessage(conversationId), 1000);
      return () => clearInterval(intervalId);
    }
  }, [conversationId]);


  return <div>{lastMessage}</div>;
};

export default LastMessage;
