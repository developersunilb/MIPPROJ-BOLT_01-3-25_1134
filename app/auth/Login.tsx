import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase"; // Change to named import


/**
 * Login component that handles user authentication.
 */
const Login = () => {
  /**
   * Handles the login process using provided email and password.
   * @param email - The email address of the user.
   * @param password - The password of the user.
   */
  const handleLogin = async (email: string, password: string) => {
    try {
      // Attempt to sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in:", userCredential.user);
    } catch (error) {
      // Log any errors that occur during the login process
      console.error("Error logging in:", error);
    }
  };

  return (
    <div>
      {/* Button to trigger the login process with test credentials */}
      <button onClick={() => handleLogin("user@example.com", "password123")}>Login</button>
    </div>
  );
};

export default Login;
