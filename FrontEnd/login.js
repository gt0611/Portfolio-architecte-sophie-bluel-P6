const form = document.querySelector("form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#email");
  const password = document.querySelector("#password");
  //  verifier l'email
  const errorLogin = document.querySelector(".error_login");
  pElement = document.createElement("p");
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });
  console.log(response);
  if (response.ok === true) {
    const user = await response.json();
    window.localStorage.setItem("token", user.token);
    window.location.replace("/");
  } else {
    pElement.textContent = "Erreur dans l’identifiant ou le mot de passe";
    errorLogin.append(pElement);
  }
});
