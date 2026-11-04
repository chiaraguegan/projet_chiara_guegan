/* GET DATA */

async function getTrees() {
    const requestURL =
        "https://datarmor.cotesdarmor.fr/data-fair/api/v1/datasets/arbres-remarquables-des-cotes-d'armor/lines?size=1000&q=typearbre=remarquable";

    const request = new Request(requestURL);
    const response = await fetch(request);
    const respJSON = await response.json();

    return respJSON.results;
}

const TREES = await getTrees();

console.log(TREES);

/* CARTE */

const map = L.map("map");

map.setView([48.6, -2.8], 9);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap"
}).addTo(map);

/* ICONE */

const treeIcon = L.icon({
    iconUrl: "./images/marker.png",
    iconSize: [40, 55],
    iconAnchor: [20, 55],
});

/* FOCUS */

const focus = document.querySelector(".tree-focus");

function afficherDetails(arbre) {

    focus.innerHTML = "";

    const titre = document.createElement("h3");
    titre.innerText = arbre.Essence;

    const commune = document.createElement("h4");
    commune.innerText = "à " + arbre.Commune;

    const lieu = document.createElement("p");
    lieu.innerText = "Lieu : " + arbre.Lieudit;

    const circonference = document.createElement("p");
    circonference.innerText = "Circonférence : " + arbre.Dimensioncirconference + " m";

    const envergure = document.createElement("p");
    envergure.innerText = "Envergure : " + arbre.dimensionenvergure + " m";

    focus.append(titre);
    focus.append(commune);
    focus.append(lieu);
    focus.append(circonference);
    focus.append(envergure);
}

/* COORDONNEES */

function trouverCoordonnees(arbre) {

    if (arbre._geopoint) {
        return arbre._geopoint.split(",");
    }

    return null;
}


/* MARQUEURS */

for (let i = 0; i < TREES.length; i++) {
    const arbre = TREES[i];

    const coordonnees = trouverCoordonnees(arbre);

    if (coordonnees !== null) {
        const marker = L.marker(coordonnees, {
            icon: treeIcon
        });

        marker.addTo(map);

        marker.addEventListener("click", function () {
            afficherDetails(arbre);
        });
    }
}

