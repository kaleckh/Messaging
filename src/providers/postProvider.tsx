import { createContext, useState, ReactNode, useEffect } from "react";
import { post } from "../utils";


// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext({ myUsername: localStorage.getItem('user'), setMyUsername: (value: string) => { }, person: '', setPerson: (value: string) => { }, myConvos: [], getConvos: () => { }, deleteConvos: (id: string) => { }, updateMessages: (id: string, messages: {}[], users: []) => { } });

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(localStorage.getItem('user'))
  const [person, setPerson] = useState('')
  const [myConvos, setMyConvos] = useState([])
  const [convoId, setConvoId] = useState([])


  // const addMessages = async () => {
  //   const addMessage = await post({
  //     url: `http://localhost:3000/api/addMessage`,
  //     body: {
  //       messages: messages,
  //       me: localStorage.getItem('user'),
  //       users: uniqueUsers?.filter((unq) => unq !== localStorage.getItem('user')),
  //     },
  //   });
  //   setConvoId(addMessage.update.id)
  // };

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
      setMyConvos(userInfo.Posts)
      console.log(userInfo.Posts, "this is convo response");
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  // const addMessages = async (id: string, messages: {}[], users: []) => {
  //   const addMessage = await post({
  //     url: `http://localhost:3000/api/addMessage`,
  //     body: {
  //       messages: messages,
  //       me: localStorage.getItem('user'),
  //       users
  //     },
  //   });
  //   setConvoId(addMessage.update.id)
  //   console.log(addMessage.update, 'this is adding a message')
  //   getConvos()
  // };


  const deleteConvos = async (id: string) => {
    try {
      const convos = await fetch(
        `http://localhost:3000/api/deleteConvo`,
        {
          method: "POST",
          body: JSON.stringify({
            id: id
          }),
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const thisConvo = await convos.json();
      console.log(thisConvo.update, 'this is deleting the convo')
      getConvos()
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };


  const updateMessages = async (id: string, messages: {}[], users: []) => {
    console.log('shit might be working', id, users, messages)
    const addMessage = await post({
      url: `http://localhost:3000/api/updateMessages`,
      body: {
        messages: messages,
        me: localStorage.getItem('user'),
        id,
        users
      },
    });
    getConvos()
  };



  return (
    <MyContext.Provider value={{ myUsername, setMyUsername, person, setPerson, myConvos, getConvos, deleteConvos, updateMessages }}>
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };
