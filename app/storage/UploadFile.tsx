import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../../lib/firebase"; // Ensure this is correctly exported

/**
 * A function component that handles file uploads to Firebase Storage.
 * When a file is selected, it uploads the file to the "uploads" folder
 * in the default Firebase Storage bucket.
 *
 * @returns A JSX element containing a file input
 */
const UploadFile = () => {
  /**
   * Handles the file upload. Gets the file from the input element,
   * creates a reference to the destination in Firebase Storage, and
   * uploads the file using the `uploadBytes` method.
   * @param file The file to be uploaded
   */
  const handleUpload = async (file: File) => {
    const storageRef = ref(storage, `uploads/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      console.log(`File uploaded successfully to ${storageRef.fullPath}!`);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload">Upload File:</label>
      {/* When the file input changes, call `handleUpload` with the selected file */}
      <input type="file" id="file-upload" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
    </div>
  );
};

export default UploadFile;
