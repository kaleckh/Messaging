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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcnFydWt4dmVzYmh0aW1mam0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcxMzMwMzc1MiwiZXhwIjoyMDI4ODc5NzUyfQ.PL71cvIQHRnrUiA4QSPO4odky2s9PYE5dJ493s5sMVg";

type Message = {
  userName: string;
  message: string;
  date: Date;
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const channel = useRef<RealtimeChannel | null>(null);
  const { myUsername, person, setPerson, getConvos, addMessage } =
    useContext(MyContext);
  const history = useHistory();
  const [recipient, setRecipient] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | null>(myUsername);
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    setRoomName(`${localStorage.getItem("user")}${recipient}`);
  }, [recipient]);

  useEffect(() => {
    if (messages.length === 1) {
      createConversation();
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

  const onSend = () => {
    if (!channel.current || message.trim().length === 0) return;
    channel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: { message, userName } },
    });
    setMessage("");
  };

  const createConversation = async () => {
    const response = await post({
      url: `http://localhost:3000/api/createConversation`,
      body: {
        messages,
        me: localStorage.getItem("user"),
        roomName: `${localStorage.getItem("user")}${recipient}`,
        recipient,
      },
    });
    history.push(`/chat/${response.update.id}`);
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
                  setRecipient(e.detail.value as string);
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
                className={`${
                  myUsername === msg.userName ? "centerEnd" : "centerBeginning"
                }`}
              >
                <div
                  className={`${
                    myUsername === msg.userName ? "blueEnd" : "grayEnd"
                  }`}
                >
                  {messages[i - 1]?.userName === msg.userName ? (
                    <></>
                  ) : (
                    <div className="user">{msg.userName}</div>
                  )}
                </div>
                <div
                  className={`message ${
                    myUsername === msg.userName ? "blue" : "gray"
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
              onIonInput={(e) => setMessage(e.detail.value!)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  onSend();
                }
              }}
              className="something"
            />
            <IonButton onClick={onSend} size="small">
              <IonIcon icon={sendOutline}></IonIcon>
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Chat;
