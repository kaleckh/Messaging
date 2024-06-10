import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonNav, IonRouterOutlet, setupIonicReact, } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import ViewMessage from './pages/ViewMessage';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';

setupIonicReact();

const App: React.FC = () => (


  <IonNav root={() => (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" exact={true}>
            <Redirect to="/login" />
          </Route>
          <Route path="/home" exact={true}>
            <Home />
          </Route>
          <Route path="/login" exact={true}>
            <Login /> 
          </Route>
          <Route path="/message/:id">
            <ViewMessage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )}>
  </IonNav>
);

export default App;
