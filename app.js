const prevBtnElement = document.getElementById("previous");
const nextBtnElement = document.getElementById("next");

const pokemonCards = document.getElementById("pokemon-cards");

const colorsElement = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

const fetchApi = async (url) => {
  return (await fetch(url)).json();
};

let previous,
  next = null;
const showData = async (url) => {
  const data = await fetchApi(url);
  const resultData = data.results;
  const resultLength = resultData.length;
  const list = [];
  previous = data.previous;
  next = data.next;

  for (let index = 0; index < resultLength; index++) {
    list.push(fetchApi(resultData[index].url));
  }
  Promise.all(list).then((data) => {
    while (pokemonCards.hasChildNodes()) {
      pokemonCards.removeChild(pokemonCards.firstChild);
    }
    console.log(data);
    display(data);
  });
};

const display = async (data) => {
  try {
    const dataLength = data.length;
    for (let index = 0; index < dataLength; index++) {
      const pokemonId = data[index].id;
      const pokemonName = data[index].name;
      const pokemonImg =
        data[index].sprites.other["official-artwork"].front_default;
      const pokemonTypes = data[index].types
        .map((pokemon) => {
          let bgColor;
          for (const type in colorsElement) {
            if (pokemon.type.name === type) {
              bgColor = colorsElement[type];
            }
          }
          return `<li class="list-group-item" style="background:${bgColor}">${pokemon.type.name}</li>`;
        })
        .join("");

      pokemonCards.innerHTML += `
        <div class="card shadow-sm">
            <img src=" ${pokemonImg}" class="card-img-top p-3" alt=" ${pokemonName} ">
            <div class="card-body px-0">
                <h5 class="card-title text-center">${pokemonName}</h5>
                <div class="card-text pokemon-types d-flex justify-content-center gap-1">${pokemonTypes}</div>
                <div class="card-text pokemon-id">${pokemonId}</div>
            </div>
        </div>`;
      //   console.log(pokemonId, pokemonName, pokemonImg, pokemonTypes);
    }
  } catch (error) {
    console.log("error", error);
  }
};

const prevBtn = async () =>
  previous != null ? await showData(previous) : alert("lowest id");

const nextBtn = async () =>
  next != null ? await showData(next) : alert("highest id");

prevBtnElement.addEventListener("click", prevBtn);
nextBtnElement.addEventListener("click", nextBtn);

showData(`https://pokeapi.co/api/v2/pokemon/`);
