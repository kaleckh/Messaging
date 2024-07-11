import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils";



interface ContextProps {
  myUsername: string | null;
  setMyUsername: (value: string | null) => void;
  person: string;
  setPerson: (value: string) => void;
  myConvos: {
    id: string;
    me: string;
    recipient: string;
    roomName: string;
    date: string;
  }[];
  getConvos: () => void;
  deleteConvos: (id: string) => void;
  addMessage: (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string
  ) => void;
}

const MyContext = createContext<ContextProps>({
  myUsername: localStorage.getItem("user"),
  setMyUsername: () => { },
  person: "",
  setPerson: () => { },
  myConvos: [],
  getConvos: () => { },
  deleteConvos: () => { },
  addMessage: () => { },
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(
    localStorage.getItem("user")
  );
  const [person, setPerson] = useState<string>("");
  const [myConvos, setMyConvos] = useState<any[]>([]);
  const [convoId, setConvoId] = useState<any[]>([]);

  const getConvos = async () => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/getConvos?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userInfo = await convos.json();
      setMyConvos([...userInfo.Posts]);
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const deleteConvos = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/api/deleteConvo`, {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      getConvos();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const addMessage = async (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string
  ) => {
    try {
      await post({
        url: `http://localhost:3000/api/addMessage`,
        body: {
          id,
          messages: message,
          userName,
          conversationId,
          status,
          recipient,
        },
      });
      getConvos();
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  return (
    <MyContext.Provider
      value={{
        myUsername,
        setMyUsername,
        person,
        setPerson,
        myConvos,
        getConvos,
        deleteConvos,
        addMessage,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };