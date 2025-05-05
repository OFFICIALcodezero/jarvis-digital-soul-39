
import { toast } from '@/components/ui/use-toast';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface CommandData {
  action: string;
  [key: string]: any;
}

// Firebase configuration (same as in admin.html)
const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyCvFSBPzE9yne0ziYqruXAL5MLIHCHY10o",
  authDomain: "corejarvis-22369.firebaseapp.com",
  projectId: "corejarvis-22369",
  storageBucket: "corejarvis-22369.appspot.com",
  messagingSenderId: "307781562443",
  appId: "1:307781562443:web:23c1c49ab1e10a48089dce"
};

// Function to initialize Firebase - will use dynamic import to prevent loading issues
let firebaseInitialized = false;
let db: any = null;

export const initializeFirebase = async (): Promise<boolean> => {
  if (firebaseInitialized) return true;
  
  try {
    // Dynamically import Firebase
    const firebaseApp = await import('firebase/app');
    const firestoreModule = await import('firebase/firestore');
    
    // Initialize Firebase
    const app = firebaseApp.initializeApp(firebaseConfig);
    db = firestoreModule.getFirestore(app);
    firebaseInitialized = true;
    
    console.log("Firebase initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    return false;
  }
};

// Listen for commands from Firebase
export const listenForCommands = async (callback: (command: CommandData) => void) => {
  if (!await initializeFirebase()) {
    toast({
      title: "Firebase Error",
      description: "Could not initialize Firebase to listen for commands.",
      variant: "destructive"
    });
    return () => {};
  }
  
  try {
    const { collection, query, orderBy, limit, onSnapshot } = await import('firebase/firestore');
    
    // Listen to the 'commands' collection for new documents
    const commandsRef = collection(db, "commands");
    const q = query(commandsRef, orderBy("timestamp", "desc"), limit(1));
    
    const unsubscribe = onSnapshot(q, (snapshot: any) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === "added") {
          const data = change.doc.data();
          console.log("New command received:", data);
          callback(data);
        }
      });
    }, (error: any) => {
      console.error("Error listening to commands:", error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error("Error setting up command listener:", error);
    return () => {};
  }
};

// Send a command to Firebase
export const sendCommand = async (command: CommandData): Promise<boolean> => {
  if (!await initializeFirebase()) {
    toast({
      title: "Firebase Error",
      description: "Could not initialize Firebase to send command.",
      variant: "destructive"
    });
    return false;
  }
  
  try {
    const { collection, addDoc } = await import('firebase/firestore');
    await addDoc(collection(db, "commands"), {
      ...command,
      timestamp: new Date().toISOString()
    });
    console.log("Command sent successfully:", command);
    return true;
  } catch (error) {
    console.error("Error sending command:", error);
    toast({
      title: "Command Error",
      description: "Failed to send command to Firebase.",
      variant: "destructive"
    });
    return false;
  }
};
