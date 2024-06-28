import React, { useState, useEffect, useRef, useContext } from "react";
import { createClient, RealtimeChannel } from "@supabase/supabase-js";
import { sendOutline, returnUpBackOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import {
  IonHeader,
  IonIcon,
  IonInput,
  IonRouterLink,
  IonButton,
  IonPage,
  IonToolbar,
  IonTextarea,
} from "@ionic/react";

import { MyContext } from "../providers/postProvider";
import { post } from "../utils";
import "../themes/newChat.css";

const SUPABASE_URL = "https://verqruktxvesbhtimfjm.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt0eHZlc2JodGltZmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMzMDM3NTIsImV4cCI6MjAyODg3OTc1Mn0.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg";
const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<
    {
      userName: string;
      message: string;
      date: Date;
    }[]
  >([]);
  const channel = useRef<RealtimeChannel | null>(null);
  const { myUsername, person, setPerson, getConvos, addMessage } =
    useContext(MyContext);
  const history = useHistory();
  const [recipient, setRecipient] = useState();
  const [userName, setUserName] = useState<string | null>(myUsername);
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    setRoomName(`${localStorage.getItem("user")}${recipient}`);
  }, [roomName]);

  useEffect(() => {
    if (messages.length === 1) {
      createConversation();
    } else if (messages.length > 1) {
    }
  }, [messages]);

  useEffect(() => {
    if (!channel.current) {
      const client = createClient(SUPABASE_URL, SUPABASE_KEY);
      channel.current = client.channel(roomName, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      channel.current
        .on("broadcast", { event: "message" }, ({ payload }) => {
          payload.message.date = new Date();
          payload.message.status = "Delivered";
          setMessages((prev) => [...prev, payload.message]);
        })
        .subscribe();
    }
    return () => {
      if (channel.current) {
        channel.current.unsubscribe();
        channel.current = null;
      }
    };
  }, [roomName]);

  function onSend() {
    if (!channel.current || message.trim().length === 0) return;
    channel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: { message, userName } },
    });
    setMessage("");
  }

  const createConversation = async () => {
    const addMessage = await post({
      url: `http://localhost:3000/api/createConversation`,
      body: {
        messages: messages,
        me: localStorage.getItem("user"),
        roomName: `${localStorage.getItem("user")}${recipient}`,
        recipient,
      },
    });
    setConvoId(addMessage.update.id);
    history.push(`/chat/${addMessage.update.id}`);
  };

  console.log(messages, "all messages");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex">
            <IonRouterLink routerLink="/home" routerDirection="back">
              <IonIcon size="large" icon={returnUpBackOutline}></IonIcon>
            </IonRouterLink>
            <div className="centeredInputContainer">
              <IonInput
                className="inputCenter"
                onIonInput={(e) => {
                  setRecipient(e?.target.value);
                }}
                type="text"
                placeholder={recipient ? recipient : "who to?"}
              ></IonInput>
            </div>
            <div></div>
          </div>
        </IonToolbar>
      </IonHeader>
      <div className="freshPage">
        <div className="column">
          {messages?.map((msg, i) => (
            <div
              key={i}
              className={` ${myUsername === msg.userName ? "end" : "start"}`}
            >
              <div
                className={`${myUsername === msg.userName ? "centerEnd" : "centerBeginning"}`}
              >
                <div
                  className={`${myUsername === msg.userName ? "blueEnd" : "grayEnd"}`}
                >
                  {messages[i - 1]?.userName === msg.userName ? (
                    <>{ }</>
                  ) : (
                    <div className="user">{msg.userName}</div>
                  )}
                </div>
                <div
                  className={`message ${myUsername === msg.userName ? "blue" : "gray"
                    } `}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="columnWhite">
          <div className="flex">
            <IonTextarea
              style={{
                borderBottom: "1px solid black",
                width: "90%",
                height: "fit-content",
                backgroundColor: "white",
              }}
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
            <IonButton
              onClick={() => {
                onSend();
              }}
              size="small"
            >
              <IonIcon icon={sendOutline}></IonIcon>
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Chat;
