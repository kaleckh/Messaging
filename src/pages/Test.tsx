import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard } from "@capacitor/keyboard";
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

const App = () => {
  const [messagesList, setMessagesList] = useState(MESSAGES);

  return (
    <main className="screen">
      <button
        onClick={() => {
          Keyboard.addListener("keyboardWillShow", async (info) => {
            console.log("Keyboard Will Show ", info);
          });
        }}
      >
        show keyboard
      </button>
      <button>Hide key maube</button>
    </main>
  );
};

export default App;
