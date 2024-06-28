import { useState } from "react";
import { supabase } from "./Supabase";
import { IonButton, IonContent, IonInput, IonItem } from "@ionic/react";
import { useHistory } from "react-router";

const CreateAccount = ({ setToggle }: { setToggle: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const history = useHistory();

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
