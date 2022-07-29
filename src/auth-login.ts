import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import getFormValues from "./functions/getFormValues";

const pageAuth = document.querySelector("body#auth #login") as HTMLBodyElement;

const auth = getAuth();

if (pageAuth) {
  const form = pageAuth.querySelector("#form-login") as HTMLFormElement;
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

    const { email, password } = getFormValues(form);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {

        const { user } = userCredential;

        const span = form.querySelector("span") as HTMLSpanElement;

        span.innerText = `Seja bem vindo ${user.displayName}!`;

        setTimeout(() => {
          window.location.href = "index.html";
        }, 5000);

      })
      .catch((error) => {

        const errorCode = error.code;

        if (errorCode == "auth/wrong-password") {

          span.innerText = "senha incorreta!";

        } else if (errorCode == "auth/user-not-found") {

          span.innerText = "usuário não encontrado!";

        } else {
          span.innerText = "fale com um administrador!";
        }
      });
  });
}
