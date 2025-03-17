// DOM Elements
const pokemonListUI = document.getElementById('pokemonList');
const pokemonsTypes = document.querySelector('#pokemonType');
const form = document.querySelector('#searchForm');
const sortBtn = document.getElementById('sort-btn');
const modalContent = document.getElementById("pokemonDetailsContent");

let listPokemons = [];
let filteredPokemons = [];

// Fetch Pokémon data
async function getPokemons() {
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150");
        const data = await response.json();

        const promises = data.results.map(async pokemon => {
            const res = await fetch(pokemon.url);
            const fullData = await res.json();
            
            // Salvamos apenas os dados essenciais para economizar espaço
            return {
                id: fullData.id,
                name: fullData.name,
                types: fullData.types.map(t => t.type.name),
                sprite: fullData.sprites?.front_default || 'placeholder.png',
                height: fullData.height / 10,
                weight: fullData.weight / 10
            };
        });

        listPokemons = await Promise.all(promises);
        updateUI(listPokemons);
    } catch (err) {
        console.error("Erro ao buscar Pokémon:", err);
    }
}

// Função para obter tipos formatados
function getTypes(types) {
    return types.length ? types.join(' | ') : 'Unknown';
}

// Exibir Pokémon na tela
function displayPokemonData(pokemon) {
    return `
        <div class="card" style="width:11rem" role="button" id="${pokemon.id}" data-bs-toggle="modal" data-bs-target="#pokemonDetailsModal">
            <img src="${pokemon.sprite}" class="card-img-top" alt="${pokemon.name}">
            <div class="card-body text-center">
                <h5 class="card-title"><span>#${pokemon.id}</span> ${pokemon.name}</h5>
                <a class="btn btn-sm" id="types">${getTypes(pokemon.types)}</a>
            </div>
        </div>`;
}

// Atualizar UI
function updateUI(pokemons) {
    pokemonListUI.innerHTML = pokemons.map(displayPokemonData);
    attachCardListeners();
}

// Adicionar eventos nos cards
function attachCardListeners() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', function () {
            const pokemonId = this.getAttribute("id");
            const pokemon = listPokemons.find(p => p.id == pokemonId);
            if (pokemon) displayDetails(pokemon);
        });
    });
}

// Exibir detalhes no modal
function displayDetails(pokemon) {
    modalContent.innerHTML = `
        <div class="text-center">
            <img src="${pokemon.sprite}" alt="${pokemon.name}" class="img-fluid mb-3">
            <h4>#${pokemon.id} ${pokemon.name}</h4>
            <p><strong>Types:</strong> ${getTypes(pokemon.types)}</p>
            <p><strong>Height:</strong> ${pokemon.height} m</p>
            <p><strong>Weight:</strong> ${pokemon.weight} kg</p>
        </div>`;
}

// Filtrar Pokémon por tipo
function getPokemonsByType(type) {
    const filtered = type ? listPokemons.filter(p => p.types.includes(type)) : listPokemons;
    updateUI(filtered);
}

// Evento para filtrar por tipo
pokemonsTypes.addEventListener('change', (e) => {
    e.preventDefault();
    getPokemonsByType(e.target.value);
});

// Ordenar Pokémon
function sortPokemons() {
    const sorted = [...(filteredPokemons.length ? filteredPokemons : listPokemons)].sort((a, b) => a.name.localeCompare(b.name));
    updateUI(sorted);
}

// Evento para ordenar
sortBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sortPokemons();
});

// Buscar Pokémon pelo nome
function searchByName(query) {
    const searchResults = listPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query.toLowerCase()));
    updateUI(searchResults.length ? searchResults : []);
}

// Evento para busca
form.addEventListener('input', (e) => {
    e.preventDefault();
    searchByName(e.target.value);
});

// Scroll para o topo
document.getElementById("scrollUP")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Inicializar
getPokemons();
