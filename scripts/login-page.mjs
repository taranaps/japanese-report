
// Import the necessary functions from Firebase SDK
import { auth } from "./firebaseConfig.mjs";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";  // Use the same version for auth
const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('toggle-password');

  togglePassword.addEventListener('click', function() {
    // Toggle password visibility
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    // Toggle icon between showing and hiding password
    // this.textContent = type === 'password' ? '👁️‍🗨️': '👁️'  ;
    this.innerHTML = type === 'password' ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';

  });

  document.getElementById("login-btn").addEventListener("click", function () {
  console.log("login clicked");
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  
  
  signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // alert(userCredential)
              const user = userCredential.user;
              window.location.href = "../pages/home-page.html"
      })
      .catch((error) => {
          const errorCode = error.code;
          let errorMessage = '';

          // Customize error message based on Firebase authentication error code
          // console.log("Errortype" + errorCode);
          
          switch (errorCode) {
            
              // case 'auth/wrong-password':
             case 'auth/missing-password':
                errorMessage = "Enter the password.";
                  break;
             case 'auth/user-not-found':
                errorMessage = "No account found with this email. Please sign up.";
                alert(errorMessage);
                break;
              case 'auth/invalid-email':
                errorMessage = "Enter a valid Email & Password";
                break;
              case 'auth/invalid-credential':
                errorMessage = "Invalid Email/Password";
                break;
              case 'auth/too-many-requests':
                errorMessage = "Too many login attempts. Please try again later.";
                break;
              default:
                errorMessage = "Login Failed.Please try again.";
          }

          // Display the error message
          document.getElementById("error-message").innerText = errorMessage;
          // console.error("Error logging in:", errorMessage);
      });
});
