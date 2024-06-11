import { createContext, useState, ReactNode, useEffect } from "react";


// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext({ myUsername: localStorage.getItem('user'), setMyUsername: (value: string) => { }, person: '', setPerson: (value: string) => { }, myConvos: [], getConvos: () => { } });

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(localStorage.getItem('user'))
  const [person, setPerson] = useState('')
  const [myConvos, setMyConvos] = useState([])

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

  return (
    <MyContext.Provider value={{ myUsername, setMyUsername, person, setPerson, myConvos, getConvos }}>
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };
