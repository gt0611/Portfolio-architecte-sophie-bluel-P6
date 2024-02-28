const token = window.localStorage.getItem("token");
if (token) {
  const loginLink = document.querySelector("#login");
  loginLink.innerText = "logout";
  loginLink.href = "#";
  loginLink.addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  });
} else {
  const categories = await getCategories();
  // ajout de tous dans l'objet catégories
  categories.unshift({ id: 0, name: "Tous" });
  const btn = document.querySelector(".categories");
  showCategories(categories, btn);
}
// recupération des works dans l'API
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
const works = await getWorks();
const gallery = document.querySelector(".gallery");

// Affichage des Works
async function showWorks(arrayWorks) {
  gallery.innerHTML = null;
  arrayWorks.forEach((work) => {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.textContent = work.title;
    // Ajout au parents
    gallery.append(figureElement);
    figureElement.append(imgElement, figcaptionElement);
  });
}
showWorks(works);

// Récupération des catégories sur l'Api
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Affichage des Catégories
async function showCategories(arrayCategories, btn) {
  arrayCategories.forEach((categories) => {
    const btnElement = document.createElement("button");
    if (categories.id == 0) {
      btnElement.classList.add("categories_selected");
    }
    btnElement.addEventListener("click", () => {
      const oldBtn = document.querySelector(".categories_selected");
      oldBtn.classList.remove("categories_selected");
      btnElement.classList.add("categories_selected");

      if (categories.id == 0) {
        return showWorks(works);
      }
      const filterWorks = works.filter((work) => {
        return work.categoryId === categories.id;
      });
      showWorks(filterWorks);
    });
    btnElement.textContent = categories.name;
    // ajout du parent
    btn.append(btnElement);
  });
}

const dialog = document.querySelector("#dialog");
const showDialog = document.querySelector("#showdialog");
const closeDialog = document.querySelector("#closedialog");

// L'icone « Mode edition » ouvre la modale <dialog>
showDialog.addEventListener("click", () => {
  dialog.showModal();
});
// la croix ferme la modale <dialog>
closeDialog.addEventListener("click", (event) => {
  dialog.close();
});
