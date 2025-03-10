import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Recipient } from '@/types/recipient';

const RECIPIENTS_COLLECTION = 'recipients';

export const addRecipient = async (recipient: { name: string }) => {
  try {
    const docRef = await addDoc(collection(db, RECIPIENTS_COLLECTION), {
      ...recipient,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding recipient:', error);
    throw error;
  }
};

export const getRecipients = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, RECIPIENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Recipient[];
  } catch (error) {
    console.error('Error getting recipients:', error);
    throw error;
  }
};

export const deleteRecipient = async (id: string) => {
  try {
    const docRef = doc(db, RECIPIENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting recipient:', error);
    throw error;
  }
};