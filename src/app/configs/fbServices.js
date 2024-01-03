import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3oQV62NvrgNt7bYi16Qc1YXQSav38BJ4",
  authDomain: "femsa-arg.firebaseapp.com",
  projectId: "femsa-arg",
  storageBucket: "femsa-arg.appspot.com",
  messagingSenderId: "435205195495",
  appId: "1:435205195495:web:96136041785ea785af8442",
  measurementId: "G-87L3H0JMWB",
};

export const listAllByFolder = (folder, setData) => {
  const storage = getStorage();
  const listRef = ref(storage, folder);

  listAll(listRef)
    .then((res) => {
      res.items.forEach(async (itemRef) => {
        await getDownloadURL(itemRef).then((url) => {
          setData((arr) => [...arr, url]);
          console.log(url);
        });
      });
    })
    .then(() => console.log("ret"))
    .catch((error) => {
      console.error("error: ", error);
    });
};

// Initialize Firebase
export const appFB = initializeApp(firebaseConfig);
export const analytics = getAnalytics(appFB);
export const storage = getStorage(appFB);
export const auth = getAuth(appFB);
