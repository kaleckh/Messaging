import { useEffect, useState } from "react";
import "./MessageListItem.css";

const LastMessage = ({
  conversationId,
  setStatus,
  setLastUser,
  setData,
}: {
  setData: (data: {}) => void;
  conversationId: string; // Adjusted to string type
  setStatus: (status: string) => void;
  setLastUser: (username: string) => void;
}) => {
  const [lastMessage, setLastMessage] = useState<string>(""); // Specify string type for state

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
      const fullMessage =
        userInfo.Response[userInfo.Response.length - 1].message;
      if (fullMessage.length > 10) {
        setLastMessage(fullMessage.substring(0, 15) + "...");
      } else {
        setLastMessage(fullMessage);
      }
      // setData(userInfo.Response[userInfo.Response.length - 1]);
      // setLastUser(userInfo.Response[userInfo.Response.length - 1].userName);
      return fullMessage; // Return the full message if needed elsewhere
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

  return <div className="grayLetters">{lastMessage}</div>;
};

export default LastMessage;
