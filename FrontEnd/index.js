// stockage du token dans le localStorage et paramétrage de connexion mode admin
const token = window.localStorage.getItem("token");
const categories = await getCategories();

if (token) {
  const loginLink = document.querySelector("#login");
  const edit = document.querySelector(".edit");
  edit.style.display = "flex";
  const iconModif = document.querySelector(".modif i");
  iconModif.style.display = "flex";
  const pModif = document.querySelector(".modif p");
  pModif.style.display = "flex";
  loginLink.innerText = "logout";
  loginLink.href = "#";
  loginLink.addEventListener("click", () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  });
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

  dialog.addEventListener("click", (e) => {
    if (e.target == dialog) {
      dialog.close();
    }
  });
  const modal = document.querySelector("#modal-add");
  const showModalAdd = document.querySelector("#show-modal-add");
  const closeModal = document.querySelector("#close-modal");
  const form = document.querySelector(".modal-form");
  const goBack = document.querySelector("#goback");
  const fileInput = document.querySelector("#images");
  const titleInput = document.querySelector("#title");
  const categoryInput = document.querySelector("#category");
  const submitButton = document.querySelector("#submit-form");
  const selectForm = document.querySelector("select");
  const optionObjet = document.createElement("option");
  optionObjet.value = "1";
  optionObjet.innerHTML = "Objet";
  const optionAppartement = document.createElement("option");
  optionAppartement.value = "2";
  optionAppartement.innerHTML = "Appartement";
  const optionHotelRestaurant = document.createElement("option");
  optionHotelRestaurant.value = "3";
  optionHotelRestaurant.innerHTML = "Hôtel et restaurant";
  selectForm.append(optionObjet, optionAppartement, optionHotelRestaurant);

  showModalAdd.addEventListener("click", () => {
    modal.showModal();
    dialog.close();
  });

  closeModal.addEventListener("click", () => {
    modal.close();
  });

  goBack.addEventListener("click", () => {
    dialog.showModal();
    modal.close();
  });

  modal.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.close();
    }
  });

  fileInput.addEventListener("change", onInputChange);
  titleInput.addEventListener("change", onInputChange);
  categoryInput.addEventListener("change", onInputChange);

  function onInputChange(e) {
    console.log(fileInput.value, titleInput.value, categoryInput.value);
    if (fileInput.value && titleInput.value && categoryInput.value) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("submit");
  });
} else {
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
const galleryModal = document.querySelector("#gallery-modal");

// recuperation des works plus id pour supprimer les works
async function deleteWork(workId) {
  await fetch("http://localhost:5678/api/works/" + workId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + window.localStorage.getItem("token"),
    },
  });
  return;
}

// Affichage des Works
function showWorks(arrayWorks) {
  gallery.innerHTML = "";
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

//Affichage des works pour la modal
function showWorksModal(arrayWorks) {
  galleryModal.innerHTML = "";
  arrayWorks.forEach((work) => {
    const imgContainer = document.createElement("div");
    imgContainer.classList.add("gallery-modal-container");

    const trash = document.createElement("div");
    trash.classList.add("trash-icon");

    const icon = document.createElement("i");
    icon.classList.add(...["fa-solid", "fa-trash-can"]);

    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    imgElement.alt = work.title;

    imgContainer.append(imgElement, trash);
    trash.append(icon);
    galleryModal.append(imgContainer);

    trash.addEventListener("click", async () => {
      await deleteWork(work.id);
      imgContainer.remove();
    });
  });
}

showWorksModal(works);
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
