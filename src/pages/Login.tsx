import { useEffect, useState, useRef, useCallback, useContext } from "react";
// import Editor from '../components/Editor';

import {
    colorFill,
    heart,
    heartCircle,
    chatbubbleOutline,
    bookmarkOutline,
    shareOutline,
    checkmarkOutline,
    settingsOutline,
    personOutline,
    createOutline,

} from "ionicons/icons";
import {
    IonButton,
    IonText,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonMenuToggle,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonToast,
    useIonLoading,
    IonMenu,
    IonImg
} from "@ionic/react";
import { supabase } from "../components/Supabase";
// import "./Tab1.css";
import SignIn from "../components/SignIn";
import CreateAccount from "../components/CreateAccount";
import Menu from '../components/Menu'

const Login: React.FC = () => {
    const [showLoading, hideLoading] = useIonLoading();
    const [showToast] = useIonToast();

    const [localEmail, setLocalEmail] = useState(localStorage.getItem("user"));
    const [menuType, setMenuType] = useState('overlay');
    const [loggedIn, setLoggedIn] = useState("logged out");
    const [email, setEmail] = useState("logged out");
    const [myEmail, setMyEmail] = useState(localStorage.getItem('user'));
    const [userName, setUserName] = useState("logged out");
    const [loginToggle, setLoginToggle] = useState<boolean>(true);


    // useEffect(() => {
    //   if (user?.session.accessToken) {
    //     console.log('logged in')
    //   } else {
    //     getUser()
    //   }
    // }, [user])

    const handleEvent = () => {
        setLoginToggle(!loginToggle)
    }

    // useEffect(() => {
    //     if
    // }, [])

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
