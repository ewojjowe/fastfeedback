import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const db = getFirestore()

// Add a new document in collection "users"
export function createUser(uid, data) {
    return setDoc(doc(db, "users", uid), data);
}
