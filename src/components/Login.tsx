import { useState } from "react";
import { useHistory } from "react-router";
import { supabase } from "./Supabase";
import { IonButton, IonContent, IonInput } from "@ionic/react";
import "../pages/Home.css";

const SignIn = ({ setToggle }: { setToggle: () => void }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>();
  const history = useHistory();

  // const [value, setValue] = useState('<p>here is my values this is for a test</p><p><br></p><p>																																									this should go in the middle</p><p>idk about thiks one </p><p><br></p><p><br></p><p>lets see what happens</p><p><br></p><h1>this is a big header</h1>');

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) {
        console.log(error, "this is the login error");
        setError("Incorrect Password");
      }
      if (data.user?.email) {
        localStorage.setItem("user", data.user.email);
        console.log(data, "this is login data");
        history.push("/home");
      }
      //   setLoggedin(!loggedIn);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <IonContent>
      <div className="titleContainer">
        <div className="beginning">
          <div className="title">Login</div>
          <div className="grayLetters">Please Sign In To Continue</div>
        </div>
      </div>
      <div className="inputContainer">
        <div className="eighty">
          <IonInput
            className="input"
            value={email}
            placeholder="email"
            name="email"
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
            type="email"
          ></IonInput>
        </div>
        <div className="eighty">
          <IonInput
            className="input"
            value={password}
            placeholder="password"
            name="password"
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
            type="password"
          ></IonInput>
        </div>
      </div>
      <div className="loginButton">
        <IonButton
          shape="round"
          className="login"
          onClick={() => {
            handleLogin();
          }}
        >
          Log In
        </IonButton>
      </div>
      <div>{error}</div>
      <div className="titleContainerBottom">
        <div className="beginningBottom">
          <div className="grayLettersFlex">
            {" "}
            Dont have an account?{" "}
            <div
              className="largeBottom"
              onClick={() => {
                setToggle();
              }}
            >
              sign up
            </div>
          </div>
        </div>
      </div>
    </IonContent>
  );
};

export default SignIn;
