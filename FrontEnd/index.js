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
  // ferme la modale <dialog> au click à l'exterieur
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
  const titleInput = document.querySelector("#title");
  const labelInput = document.querySelector(".modal-file label");
  const icon = document.querySelector(".modal-file i");
  const categoryInput = document.querySelector("#category");
  const submitButton = document.querySelector("#submit-form");
  const fileInput = document.querySelector("#image");
  const pFile = document.querySelector(".modal-file p");
  const prewiewImg = document.querySelector(".modal-file img");

  // creation des option select et affichages des works par categorie
  async function displayCatégoriesModal() {
    const selectForm = document.querySelector("select");
    const categorys = await getCategories();
    categorys.forEach((category) => {
      const optionObjet = document.createElement("option");
      optionObjet.value = category.id;
      optionObjet.innerHTML = category.name;
      selectForm.append(optionObjet);
    });
  }
  displayCatégoriesModal();

  // visualisation de la modale
  showModalAdd.addEventListener("click", () => {
    modal.showModal();
    dialog.close();
  });
  // ferme la modale
  closeModal.addEventListener("click", () => {
    modal.close();
  });
  // retour a la modale précèdente
  goBack.addEventListener("click", () => {
    dialog.showModal();
    modal.close();
  });
  // ferme la modale au click a l'exterieur de la modale
  modal.addEventListener("click", (e) => {
    if (e.target == modal) {
      modal.close();
    }
  });

  //Écoute le changement des input du formulaire
  fileInput.addEventListener("change", (e) => {
    const file = fileInput.files[0];
    const fileErreur = document.querySelector(".file-erreur");
    if (
      (fileInput.files[0].type === "image/png" ||
        fileInput.files[0].type === "image/jpeg") &&
      fileInput.files[0].size <= 400000
    ) {
      //ici afficher l'image
      fileErreur.style.display = "none";
      onInputChange(e);
      const reader = new FileReader();
      reader.onload = function (e) {
        prewiewImg.src = e.target.result;
        prewiewImg.style.display = "flex";
        labelInput.style.display = "none";
        icon.style.display = "none";
        pFile.style.display = "none";
      };
      reader.readAsDataURL(file);
    } else {
      fileInput.value = null;
      fileErreur.style.display = "block";
    }
  });
  titleInput.addEventListener("change", onInputChange);
  categoryInput.addEventListener("change", onInputChange);
  //Change l'apparence du bouton du form
  function onInputChange(e) {
    console.log(fileInput.value, titleInput.value, categoryInput.value);
    if (checkValidity()) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

  function checkValidity() {
    return fileInput.value && titleInput.value && categoryInput.value;
  }

  // Écoute l'envoi du form au submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("submit");

    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("category", Number(categoryInput.value));
    formData.append("image", fileInput.files[0]);

    await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + window.localStorage.getItem("token"),
      },
      body: formData,
    });
    const works = await getWorks();
    showWorks(works);
    showWorksModal(works);
    return modal.close();
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
  const works = await getWorks();
  showWorksModal(works);
  showWorks(works);
  return dialog.close();
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
