import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile, onAuthStateChanged
} from "firebase/auth";
import getFormValues from "./functions/getFormValues";

const pageRegister = document.querySelector(
  "body#auth #register"
) as HTMLElement;

const auth = getAuth();


if (pageRegister) {
  const form = pageRegister.querySelector("form") as HTMLFormElement;
  const span = form.querySelector("span") as HTMLSpanElement;
  span.style.marginTop = "10px";

  onAuthStateChanged(getAuth(), () => {
    if (auth.currentUser) { 

      const url_atual = window.location.href;

      if (url_atual) {

        window.location.assign("index.html");

      }
      
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const { name, email, password } = getFormValues(form);

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { user } = userCredential;

        span.innerText = "Registro feito com sucesso!";

        updateProfile(user, {
          displayName: name,
        }).then(() => {
            setTimeout(() => {
              window.location.href = "login.html";
            }, 3000);
          })
          .catch((error) => {
            
            const errorCode = error.code;

            console.log(errorCode);

          });
      })
      .catch((error) => {
        console.error(error.message);
      });
  });
}
