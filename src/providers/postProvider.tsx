import { createContext, useState, ReactNode, useEffect } from "react";


// const MyContext = createContext({ values: [], setValues: (posts) => { } });
const MyContext = createContext({ myUsername: localStorage.getItem('user'), setMyUsername: (value: string) => { }, person: '', setPerson: (value: string) => { } });

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [myUsername, setMyUsername] = useState<string | null>(localStorage.getItem('user'))
  const [person, setPerson] = useState('')

  return (
    <MyContext.Provider value={{ myUsername, setMyUsername, person, setPerson }}>
      {children}
    </MyContext.Provider>
  );
};

export { ContextProvider, MyContext };
