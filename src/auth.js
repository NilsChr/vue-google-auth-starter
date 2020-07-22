import firebase from 'firebase/app';
import 'firebase/firebase-auth';
import * as firebaseui from 'firebaseui';

const config = {
    apiKey: process.env.VUE_APP_API_KEY,
    authDomain: "bogsynth.firebaseapp.com",
    databaseURL: "https://bogsynth.firebaseio.com",
    projectId: "bogsynth",
    storageBucket: "bogsynth.appspot.com",
    messagingSenderId: "359303561397",
    appId: "1:359303561397:web:2d73a7613b08ebd2"
  };

const auth = {
  context: null,
  uiConfig: null,
  ui: null,

  init(context) {
    this.context = context;

    firebase.initializeApp(config);
    this.uiConfig = {
      signInSuccessUrl: 'dashboard',
      signInOptions: [
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    this.ui = new firebaseui.auth.AuthUI(firebase.auth());

    firebase.auth().onAuthStateChanged((user) => {
      this.context.$store.dispatch('user/setCurrentUser')

      let requireAuth = this.context.$route.matched.some(record => record.meta.requireAuth)
      let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)

      if(requireAuth && !user) this.context.$router.push('auth')
      else if (guestOnly && user) this.context.$router.push('dashboard')
    });
  },
  authForm(container) {
    this.ui.start(container, this.uiConfig);
  },
  user() {
    return this.context ? firebase.auth().currentUser : null;
  },
  logout() {
    firebase.auth().signOut();
  }
}

export default auth;