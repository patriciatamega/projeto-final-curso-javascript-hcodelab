import { onAuthStateChanged, getAuth, signOut } from "firebase/auth";

const userPhoto = document.querySelector("img#avatar") as HTMLImageElement;
const section = document.querySelector(
  "#app section .modalBody"
) as HTMLDivElement;
const auth = getAuth();

if (userPhoto) {
  userPhoto.addEventListener("click", (e) => {
    section.innerHTML = `
        <div id="myModal" class="modal">
          <div class="modal-content">
            <div class="modal-header">
              <span class="close">&times;</span>
              <img src="./assets/images/user.png" alt="Avatar" id="avatatModal" />
              <h3>Seja Bem-vindo(a),</h3>
            </div>
            <div class="modal-body">
              <h3>${auth.currentUser?.displayName}</h3>
            </div>
            <div class="modal-footer">
              <form>
                <button type="submit" id="logout">Sair</button>
              </form>
            </div>
          </div>
        </div>
        `;

    const modal = document.querySelector("#myModal") as HTMLDivElement;

    modal.style.display = "block";

    const span = document.getElementsByClassName("close")[0] as HTMLSpanElement;

    span.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
    const logout = section.querySelector("button#logout") as HTMLButtonElement;
    logout.addEventListener("click", () => {
      signOut(auth);
    });

    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        sessionStorage.setItem('uid', user.uid);
        userPhoto.src = user.photoURL ?? "./assets/images/user.png";
      } else {
        window.location.assign("login.html");
      }
    });
  });
}
