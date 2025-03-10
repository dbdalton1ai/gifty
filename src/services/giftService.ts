import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp, Query, CollectionReference } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GiftIdea } from '@/types/gift';

const GIFTS_COLLECTION = 'gifts';

export const addGiftIdea = async (gift: Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, GIFTS_COLLECTION), {
      ...gift,
      isPurchased: false,
      isArchived: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding gift idea:', error);
    throw error;
  }
};

export const getGiftIdeas = async (recipientId?: string) => {
  try {
    const collectionRef = collection(db, GIFTS_COLLECTION);
    let q: Query | CollectionReference = collectionRef;
    if (recipientId) {
      q = query(collectionRef, where('recipientId', '==', recipientId));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as GiftIdea[];
  } catch (error) {
    console.error('Error getting gift ideas:', error);
    throw error;
  }
};

export const updateGiftIdea = async (id: string, gift: Partial<Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const docRef = doc(db, GIFTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...gift,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating gift idea:', error);
    throw error;
  }
};

export const deleteGiftIdea = async (id: string) => {
  try {
    const docRef = doc(db, GIFTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting gift idea:', error);
    throw error;
  }
};