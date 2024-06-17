import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "../themes/styles.scss";

const Bob =
  "https://images.pexels.com/photos/53487/james-stewart-man-person-actor-53487.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
const John =
  "https://images.pexels.com/photos/34534/people-peoples-homeless-male.jpg?auto=compress&cs=tinysrgb&dpr=2&w=500";
const Jane =
  "https://images.pexels.com/photos/53453/marilyn-monroe-woman-actress-pretty-53453.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
const Grace =
  "https://images.pexels.com/photos/60712/fashion-girl-sexy-women-60712.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";

const MESSAGES = [
  { id: 0, avatar: Bob, author: "Bob", message: "dolor sit amet, consect" },
  {
    id: 1,
    avatar: John,
    author: "John",
    message: "sed do eiusmod tempor incididunt ",
  },
  {
    id: 2,
    avatar: Jane,
    author: "Jane",
    message: "Excepteur sint occaecat cupidatat",
  },
  {
    id: 3,
    avatar: Grace,
    author: "Grace",
    message: "cillum dolore eu fugiat nu",
  },
];

const DELETE_BTN_WIDTH = 70;

const MESSAGE_DELETE_ANIMATION = { height: 0, opacity: 0 };
const MESSAGE_DELETE_TRANSITION = {
  opacity: {
    transition: {
      duration: 0,
    },
  },
};

const App = () => {
  const [messagesList, setMessagesList] = useState(MESSAGES);

  const handleDragEnd = (info, messageId) => {
    const dragDistance = info.point.x;
    if (dragDistance < -DELETE_BTN_WIDTH) {
      setMessagesList(
        messagesList.filter((message) => message.id !== messageId),
      );
    }
  };

  return (
    <main className="screen">
      <header>
        <h1>Messages</h1>
      </header>
      <input type="text" placeholder="🔍 Search" />
      <ul>
        <AnimatePresence>
          {messagesList.map((message) => (
            <motion.li
              key={message.id}
              exit={MESSAGE_DELETE_ANIMATION}
              transition={MESSAGE_DELETE_TRANSITION}
            >
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => handleDragEnd(info, message.id)}
                className="msg-container"
              >
                <img
                  className="user-icon"
                  src={message.avatar}
                  alt="User icon"
                />
                <div className="message-text">
                  <h3>{message.author}</h3>
                  <p>{message.message}</p>
                </div>
              </motion.div>
              <div className="delete-btn">Delete</div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </main>
  );
};

export default App;

