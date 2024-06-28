import { useState } from "react";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
// import "./Tab1.css";
import SignIn from "../components/Login";
import CreateAccount from "../components/CreateAccount";

const Login: React.FC = () => {
  const [loginToggle, setLoginToggle] = useState<boolean>(true);

  const handleEvent = () => {
    setLoginToggle(!loginToggle);
  };

  return (
    <>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {loginToggle ? (
            <>
              <SignIn setToggle={handleEvent} />
            </>
          ) : (
            <>
              <CreateAccount setToggle={handleEvent} />
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
};

export default Login;
