import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./Supabase";
import {
  IonButton,
  IonContent,
  IonCard,
  IonHeader,
  IonInput,
  IonText,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import { useHistory } from "react-router";

const CreateAccount = ({ setToggle }: { setToggle: () => void }) => {
  const [content, setContent] = useState<{ hello: [] }>();
  const [email, setEmail] = useState<string>("");
  const [userEmail, setUserEmail] = useState<any>(localStorage.getItem("user"));
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const history = useHistory();
  const [value, setValue] = useState(
    "<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>",
  );

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      const result = await fetch(`http://localhost:3000/api/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          email: email,
        }),
      });
      localStorage.setItem("user", email);
      history.push("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log(error, "this is the login error");
      }
      if (data) {
        localStorage.setItem("user", JSON.stringify(data.user?.email));
        console.log(data, "this is login data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      console.log("You Logged Out");
      if (error) {
        console.log("this is logout error", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      localStorage.setItem("user", JSON.stringify(data));
      console.log(data, "this is the data");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonContent>
      <div className="titleContainer">
        <div className="beginning">
          <div className="title">Create Account</div>
        </div>
      </div>
      <div className="inputContainer">
        <IonItem className="eighty">
          <IonInput
            className="input"
            placeholder="Username"
            name="username"
            onIonChange={(e) => setUsername(e.detail.value ?? "")}
            type="email"
          ></IonInput>
        </IonItem>
        <IonItem className="eighty">
          <IonInput
            className="input"
            placeholder="email"
            name="email"
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
            type="email"
          ></IonInput>
        </IonItem>
        <IonItem className="eighty">
          <IonInput
            className="input"
            value={password}
            placeholder="password"
            name="password"
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
            type="password"
          ></IonInput>
        </IonItem>
      </div>
      <IonItem lines="none" className="loginButton">
        <IonButton
          shape="round"
          className="login"
          onClick={() => {
            handleSignUp();
          }}
        >
          Sign Up
        </IonButton>
        <IonButton
          shape="round"
          className="login"
          onClick={() => {
            setToggle();
          }}
        >
          Log In
        </IonButton>
      </IonItem>
      <div style={{ height: "64%" }} className="titleContainerBottom">
        <div className="beginningBottom">
          <div className="grayLettersFlex">
            {" "}
            Already Have An Account?{" "}
            <div
              className="largeBottom"
              onClick={() => {
                setToggle();
              }}
            >
              sign in
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default CreateAccount;
