import MessageListItem from "../components/MessageListItem";
import { useState, useRef, useContext } from "react";
import React, { useEffect } from "react";
import { getMessaging, Messaging } from "firebase/messaging";
import supabase from "../components/supabaseClient";
import { createId } from '@paralleldrive/cuid2';
import {
  colorFill,
  heart,
  addOutline,
  sendOutline,
  checkmarkOutline,
  checkmarkDoneOutline,
  send,
  backspaceOutline,
  returnUpBackOutline,
  heartCircle,
} from "ionicons/icons";
import "../themes/chat.css";
import { Keyboard } from "@capacitor/keyboard";
import { MyContext } from "../providers/postProvider";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonButton,
  IonList,
  IonRouterLink,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
  IonNavLink,
  IonTextarea,
} from "@ionic/react";
import { useParams } from "react-router-dom";

type MessageStatus = "Delivered" | "Read";

const CurrentChat = () => {
  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<string>();
  const [status, setStatus] = useState<MessageStatus>("Delivered");
  const channel = useRef<RealtimeChannel | null>(null);
  const { id } = useParams<{ id: string }>();
  const { myUsername, person, setPerson, getConvos, addMessage, myConvos } =
    useContext(MyContext);
  const [uniqueUsers, setUniqueUsers] = useState();
  const [myConvo, setMyConvo] = useState();
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("user"),
  );
  const [roomName, setRoomName] = useState<string>(
    `${localStorage.getItem("user")}${userName}`,
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState<{
    id: string;
    users: [];
    me: string;
    message: { userName: string; message: string }[];
    recipient: string;
  }>();
  const [messages, setMessages] = useState<
    {
      id: string,
      userName: string;
      message: string;
      status: MessageStatus;
    }[]
  >([]);

  // Function to scroll to the last message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updatedMessage = async (id: string, status: string) => {
    
      try {
        const convos = await fetch(`http://localhost:3000/api/updateMessage`, {
          method: "POST",
          body: JSON.stringify({
            id,
            status
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const thisConvo = await convos.json();
        await getConvo();
      } catch (error) {
        console.log(error, "this is the create user error");
      }
    
  };

  // useEffect(() => {
  //   updatedMessage();
  // }, [messages])


  useEffect(() => {
    if (!channel.current) {
      channel.current = supabase.channel("chat-room", {
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
          if (payload.message.userName !== myUsername) {                         
            updatedMessage(payload.message.id, "Read");
          }
        })
        .subscribe();
    }
    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, []);


  useEffect(() => {
    getConvo();
    getConvoDetails();
  }, []);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  function onSend() {
    const messageId = createId()
    if (!channel.current || message.trim().length === 0) return;
    if (userName) {
      addMessage(messageId, id, message, userName, 'Delivered');
    }

    channel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: { message, userName, id: messageId } },
    });
    setMessage("");
  }


  const getConvo = async () => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/getConvo?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      setMessages(thisConvo.Posts);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };



  const getConvoDetails = async () => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/getSingleConvo?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      setInfo(thisConvo.Posts);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex">
            <IonRouterLink routerLink="/home" routerDirection="back">
              <IonIcon size="large" icon={returnUpBackOutline}></IonIcon>
            </IonRouterLink>
            <div className="centeredInputContainer">
              <IonTitle>
                {localStorage.getItem("user") === info?.me
                  ? info?.recipient
                  : info?.me}
              </IonTitle>
            </div>
            <div></div>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="page">
          <div className="column">
            {messages?.map((msg, i) => (
              <div
                key={i}
                className={` ${userName === msg.userName ? "end" : "start"}`}
              >
                <div
                  className={`${userName === msg.userName ? "centerEnd" : "centerBeginning"}`}
                >
                  <div
                    className={`${userName === msg.userName ? "blueEnd" : "grayEnd"}`}
                  >
                    {messages[i - 1]?.userName === msg.userName ? (
                      <>{ }</>
                    ) : (
                      <div className="user">{msg.userName}</div>
                    )}
                  </div>
                  <div
                    className={`message ${userName === msg.userName ? "blue" : "gray"}`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            <div
              className={
                messages[messages.length - 1]?.userName !== myUsername
                  ? "none"
                  : "end"
              }
              style={{ paddingRight: "25px" }}
            >
              {messages[messages.length - 1]?.status === "Delivered" ? (
                // <IonIcon icon={checkmarkOutline}></IonIcon>
                <div>Delivered</div>
              ) : (
                // <IonIcon icon={checkmarkDoneOutline}></IonIcon>
                <div>Read</div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
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
    </IonPage>
  );
};

export default CurrentChat;
