import { useEffect, useState } from "react";
import "./MessageListItem.css";

const LastMessage = ({
  conversationId,
  setStatus,
  setLastUser,
  setData
}: {
  setData: (data: {}) => {};
  conversationId: "";
  setStatus: (status: string) => {};
  setLastUser: (username: string) => {};
}) => {
  const [lastMessage, setLastMessage] = useState();

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
      console.log(userInfo, "this is user info");
      setLastMessage(userInfo.Response[userInfo.Response.length - 1].message);
      setData(userInfo.Response[userInfo.Response.length - 1])
      setLastUser(userInfo.Response[userInfo.Response.length - 1].userName);
      return userInfo.Response[0].message;
    } catch (error) {
      console.log(error, "this is the create user error");
    }
  };

  useEffect(() => {
    if (conversationId) {
      getLastMessage(conversationId);
      const intervalId = setInterval(
        () => getLastMessage(conversationId),
        1000,
      );
      return () => clearInterval(intervalId);
    }
  }, [conversationId]);

  return <div>{lastMessage}</div>;
};

export default LastMessage;
