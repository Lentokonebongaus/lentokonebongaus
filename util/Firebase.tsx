import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get, set } from 'firebase/database';
import { getAuth, signInAnonymously } from "firebase/auth";
import { SUPER_SECRET_FIREBASE_KEY } from "./keys";


const firebaseConfig = {

  apiKey: SUPER_SECRET_FIREBASE_KEY,

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

async function getRandomCard() {
  let card = {}
  card = await get(cardsDb).then((snapshot) => {
    const cardsArray = snapshot.val()
    const cardIds = Object.keys(cardsArray)
    const randIndex = Math.floor((Math.random() * cardIds.length + 1) - 1)
    return cardsArray[cardIds[randIndex]]

  })
  return card
}

async function upgradeCardQuality(cardId, existingCard, newCardQuality) {
  const cardDb = ref(database, `cards/${cardId}`)
  set(cardDb, { ...existingCard, cardQuality: newCardQuality });
}

async function addCardWin(cardId, currentCard) {
  const cardDb = ref(database, `cards/${cardId}`)
  set(cardDb, { ...currentCard, wins: currentCard.wins + 1 });
}

async function addCardLoss(cardId, currentCard) {
  const cardDb = ref(database, `cards/${cardId}`)
  set(cardDb, { ...currentCard, losses: currentCard.losses + 1 });
}

async function authAnonymousUser() {

  const auth = getAuth();
  signInAnonymously(auth)
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode)
      console.log(errorMessage)
    });
}

export { usersDb, cardsDb, authAnonymousUser, getRandomCard, upgradeCardQuality, addCardWin, addCardLoss }