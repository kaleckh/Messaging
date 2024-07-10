import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils";

// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext({
  myUsername: localStorage.getItem("user"),
  setMyUsername: (value: string) => {},
  person: "",
  setPerson: (value: string) => {},
  myConvos: [],
  getConvos: () => {},
  deleteConvos: (id: string) => {},
  addMessage: (
    id: string,
    conversationId: string,
    message: string,
    userName: string,
    status: string,
    recipient: string,
  ) => {},
});

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(
    localStorage.getItem("user"),
  );
  const [person, setPerson] = useState("");
  const [myConvos, setMyConvos] = useState([]);
  const [convoId, setConvoId] = useState([]);

  const getConvos = async () => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/getConvos?email=${localStorage.getItem("user")}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const userInfo = await convos.json();
      setMyConvos((prevConvos) => [...userInfo.Posts]);
      
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  const deleteConvos = async (id: string) => {
    
    try {
      const convos = await fetch(`http://localhost:3000/api/deleteConvo`, {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const thisConvo = await convos.json();
      
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
    recipient: string,
  ) => {
    
    const addMessage = await post({
      url: `http://localhost:3000/api/addMessage`,
      body: {
        id,
        messages: message,
        userName,
        conversationId,
        status: status,
        recipient,
      },
    });
    await getConvos();
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
