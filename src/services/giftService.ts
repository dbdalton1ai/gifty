import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, serverTimestamp, getDoc, Query, CollectionReference } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { GiftIdea } from '@/types/gift';

const GIFTS_COLLECTION = 'gifts';
const RECIPIENTS_COLLECTION = 'recipients';

export const addGiftIdea = async (gift: Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt' | 'isPurchased' | 'isArchived'>) => {
  try {
    // Get recipient details
    const recipientDoc = await getDoc(doc(db, RECIPIENTS_COLLECTION, gift.recipientId));
    if (!recipientDoc.exists()) {
      throw new Error('Recipient not found');
    }

    const recipientData = recipientDoc.data();
    const docRef = await addDoc(collection(db, GIFTS_COLLECTION), {
      ...gift,
      recipientName: recipientData.name,
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

export const updateGiftIdea = async (id: string, updates: Partial<Omit<GiftIdea, 'id' | 'createdAt' | 'updatedAt'>>) => {
  try {
    const docRef = doc(db, GIFTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
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