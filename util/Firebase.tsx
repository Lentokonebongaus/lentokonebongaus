import{ initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, update } from 'firebase/database';

const firebaseConfig = {

    apiKey: "***REMOVED***",
  
    authDomain: "lentokonebongaus.firebaseapp.com",
  
    databaseURL: "https://lentokonebongaus-default-rtdb.europe-west1.firebasedatabase.app",
  
    projectId: "lentokonebongaus",
  
    storageBucket: "lentokonebongaus.appspot.com",
  
    messagingSenderId: "313722689412",
  
    appId: "1:313722689412:web:5cfa1aa1fcaf68c40fafd1"
  
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const usersDb = ref(database, "users");
const cardsDb = ref(database, "cards");

export { usersDb, cardsDb }