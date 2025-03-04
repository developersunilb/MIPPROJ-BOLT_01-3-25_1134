import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Change to named import


/**
 * Component for adding a new user to the Firestore database.
 * 
 * @returns JSX Element containing a button to add user data.
 */
const AddData = () => {
  /**
   * Handles the addition of new user data to the Firestore collection.
   * 
   * @remarks
   * - Utilizes the "addDoc" function from Firestore to add a new document.
   * - Logs the document ID upon successful addition.
   * - Logs an error message if the addition fails.
   */
  const handleAddData = async () => {
    try {
      // Add a new document to the "users" collection in Firestore
      const docRef = await addDoc(collection(db, "users"), {
        name: "John Doe",
        email: "john@example.com",
      });
      
      // Log the document ID of the newly added document
      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      // Log any errors that occur during the document addition
      console.error("Error adding document:", error);
    }
  };

  return (
    <div>
      <button onClick={handleAddData}>Add Data</button>
    </div>
  );
};

export default AddData;
