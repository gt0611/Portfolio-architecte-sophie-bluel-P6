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
  arrayWorks.forEach((works) => {
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    imgElement.src = works.imageUrl;
    imgElement.alt = works.title;
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.textContent = works.title;
    // Ajout au parents
    gallery.append(figureElement);
    figureElement.append(imgElement, figcaptionElement);
  });
}
showWorks(works);

const btn = document.querySelector(".categories");

// Récupération des catégories sur l'Api
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
const categories = await getCategories();
// ajout de tous dans l'objet catégories
categories.unshift({ id: 0, name: "Tous" });
// Affichage des Catégories
async function showCategories(arrayCategories) {
  arrayCategories.forEach((categories) => {
    const btnElement = document.createElement("button");
    btnElement.addEventListener("click", () => {
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
showCategories(categories);
