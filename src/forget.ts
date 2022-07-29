import { getAuth, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import getFormValues from "./functions/getFormValues";

const form = document.querySelector("form#form-forget") as HTMLFormElement;
const auth = getAuth();


if (form) {
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

    const { email } = getFormValues(form);

      sendPasswordResetEmail(auth, email)

        .then(() => {

          const button = form.querySelector("button") as HTMLButtonElement;
          const input = form.querySelector("input") as HTMLButtonElement;
          button.disabled = true;
          input.value = "";
          
          
          span.innerText = "Instruções enviadas para seu e-mail!";

        })

        .catch((error) => console.error(error.code));
  });
}
