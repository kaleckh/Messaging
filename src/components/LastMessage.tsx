import { IonItem, IonLabel, IonNote } from "@ionic/react";
import { useEffect, useState } from "react";
import { Message } from "../data/messages";
import "./MessageListItem.css";

const LastMessage = ({ conversationId }: { conversationId: "" }) => {
  const [lastMessage, setLastMessage] = useState();

  useEffect(() => {
    getLastMessage(conversationId)
  }, [])


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
      console.log(userInfo, 'this is user info')
      setLastMessage(userInfo.Response[0].message);
      return userInfo.Response[0].message;
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  return <div>{lastMessage}</div>;
};

export default LastMessage;
