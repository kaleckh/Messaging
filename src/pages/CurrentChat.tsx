import { useState, useRef, useContext, useDebugValue } from "react";
import React, { useEffect } from "react";
import supabase from "../components/supabaseClient";
import { createId } from "@paralleldrive/cuid2";
import { sendOutline, returnUpBackOutline } from "ionicons/icons";
import "../themes/chat.css";
import { Keyboard } from '@capacitor/keyboard';
import { MyContext } from "../providers/postProvider";
import { useHistory } from "react-router";
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonButton,
  IonRouterLink,
  IonPage,
  IonTitle,
  IonToolbar,
  IonTextarea,
} from "@ionic/react";
import { useParams } from "react-router-dom";

type MessageStatus = "Delivered" | "Read";

interface Message {
  id: string;
  userName: string;
  message: string;
  status: MessageStatus;
}

interface ConvoInfo {
  id: string;
  users: [];
  me: string;
  message: { userName: string; message: string }[];
  recipient: string;
}

const CurrentChat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const channel = useRef<any>(null);
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { myUsername, person, setPerson, getConvos, addMessage, myConvos } =
    useContext(MyContext);
  const [userName, setUserName] = useState<string | null>(
    localStorage.getItem("user"),
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [info, setInfo] = useState<ConvoInfo | null>(null);
  const [load, setLoad] = useState();
  const [updatedMessagesRead, setUpdatedMessagesRead] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const index = myConvos.findIndex(item => item.id == id)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };



  const updatedMessage = async (id: string, status: MessageStatus) => {
    // s
    try {
      const convos = await fetch(`http://localhost:3000/api/updateMessage`, {
        method: "POST",
        body: JSON.stringify({
          id,
          status,
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

  useEffect(() => {
    if (
      messages.length > 0 &&
      messages[messages.length - 1]?.userName !== myUsername &&
      messages[messages.length - 1]?.status === "Delivered"
    ) {
      console.log('use effect message read')
      updateMessagesRead(id);
    }
  }, [messages]);


  useEffect(() => {
    if (messages[messages.length - 1]?.status === "Delivered") {
      getConvo()
    }
  }, [messages])

  const updateMessagesRead = async (id: string) => {
    console.log('updated message read')
    // s
    try {
      const convos = await fetch(
        `http://localhost:3000/api/updateMessageRead?`,
        {
          method: "POST",
          body: JSON.stringify({
            conversationId: id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      await getConvo();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  useEffect(() => {
    if (!channel.current) {
      channel.current = supabase.channel(myConvos[index]?.roomName, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });
      channel.current
        .on("broadcast", { event: "message" }, ({ payload }: any) => {
          payload.message.date = new Date();
          payload.message.status = "Delivered";
          setMessages([...messages, payload.message]);
          // setMessages((prev) => [...load, payload.message]);
          if (payload.message.userName !== myUsername) {
            console.log("updated message read in if")
            updatedMessage(payload.message.id, "Read");
          }
        })
        .subscribe();
    }
    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, [messages]);


  const onSend = () => {
    const messageId = createId();
    if (!channel.current || message.trim().length === 0) return;
    if (userName && info) {
      if (myUsername === info.recipient) {
        addMessage(messageId, id, message, userName, "Delivered", info.me);
      } else {
        addMessage(messageId, id, message, userName, "Delivered", info.recipient);
      }
    }
    channel.current.send({
      type: "broadcast",
      event: "message",
      payload: { message: { message, userName, id: messageId } },
    });
    setMessage("");
  };


  useEffect(() => {
    getConvo();
    getConvoDetails();
  }, [myUsername]);


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const getConvo = async () => {
    // debugger
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
      // setLoad(thisConvo.Posts)
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


  // console.log(myConvos, 'are myConvos')
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex">
            {/* <IonRouterLink routerLink="/home" routerDirection="back"> */}
            <IonRouterLink className="clickable" routerLink="/home" routerDirection="back">
              <IonIcon size="large" icon={returnUpBackOutline}></IonIcon>
            </IonRouterLink>
            {/* </IonRouterLink> */}
            <div className="centeredInputContainer">
              <IonTitle>
                {localStorage.getItem("user") === info?.me
                  ? info?.recipient
                  : info?.me}
              </IonTitle>
            </div>
            <div>...</div>
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
                  className={`${userName === msg.userName ? "centerEnd" : "centerBeginning"
                    }`}
                >
                  <div
                    className={`message ${userName === msg.userName ? "blue" : "gray"
                      }`}
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
              style={{ paddingRight: "15px" }}
            >
              {messages[messages.length - 1]?.status === "Delivered" ? (
                <div className="smallGray">Delivered</div>
              ) : (
                <div className="smallGray">Read</div>
              )}
            </div>
          </div>
        </div>
      </IonContent>
      <div className="columnWhite">
        <div style={{ paddingBottom: "10px" }} className="flexTime">
          <IonItem style={{ width: "100%" }} lines="none">
            <textarea
              onClick={() => {
                Keyboard.addListener('keyboardWillShow', info => {
                  console.log('keyboard will show with height:', info.keyboardHeight);
                });
              }}
              inputMode="text"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  onSend();
                  setMessage("");
                }
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value!)}
              className="something"
            ></textarea>
          </IonItem>
          <IonButton onClick={onSend} size="small">
            <IonIcon icon={sendOutline}></IonIcon>
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default CurrentChat;
