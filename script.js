// DOM Elements
const pokemonListUI = document.getElementById('pokemonList');
const pokemonsTypes = document.querySelector('#pokemonType');
const form = document.querySelector('#searchForm');

const sortBtn = document.getElementById('sort-btn');

// Fetch data of Pokemons
let listPokemons = [];
let filteredPokemons = [];

async function getPokemons(){
    
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150");
    const data = await response.json();
    let pokemons = data.results;
   

    // Get data of each Pokemon
    let promises = pokemons.map(async pokemon => {
        const pokemonData = pokemon.url;
        const response = await fetch(pokemonData);
        return await response.json();
    });

    listPokemons = await Promise.all(promises);
    return listPokemons;

    // Display data of Pokemons
    
    
}
function getTypes(types){
    let typesArray = [];
    types?.forEach(type => {
        typesArray.push(type.type.name);
    });
    return typesArray.join( ' | ') || pokemonsTypes.value ;
}
// Display data of Pokemons
function displayPokemonData(pokemonData){
    const {name , types , sprites} = pokemonData;
    return  `
    <div class="card" style="width:11rem" role="button" data-toggle="modal" data-target="#exampleModal">
    <img src="${sprites?.front_default ?? null } " class="card-img-top" alt="...">
    <div class="card-body text-center">
    <h5 class ="card-title">${name}</h5>
    <a class="btn btn btn-sm " id="types">${getTypes(types)} </a> 
                </div>
                </div>
                `
}//end

// Call function to fetch data of Pokemons
function updateUI(listPokemons){
    listPokemons.forEach(pokemon => {
        pokemonListUI.innerHTML += displayPokemonData(pokemon);
    });
}
getPokemons().then(listPokemons => {
    // Display data of Pokemons
    updateUI(listPokemons)
}); 

// Search functionality by type
function getPokemonsByType(type){
    if(type === '' ){
        getPokemons();
        pokemonListUI.innerHTML = '';
        updateUI(pokemonList);
        console.log(listPokemons, 'all');
        filteredPokemons = [];
        return;
    }
    filteredPokemons = listPokemons.filter(pokemon => {
        return pokemon.types.some(pokemonType => pokemonType.type.name === type);
    });

    pokemonListUI.innerHTML = '';
    updateUI(filteredPokemons);
}

pokemonsTypes.addEventListener('change', async (e) => {
    e.preventDefault();
    const selectedType = e.target.value;
    getPokemonsByType(selectedType);
    
  
});

// Sort functionality 
function sortPokemons(arr){
    let sortedPokemons = arr.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return sortedPokemons;
}
sortBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    e.preventDefault();
    const sortedPokemons = sortPokemons(filteredPokemons.length ? filteredPokemons : listPokemons);
    pokemonListUI.innerHTML = '';
    updateUI(sortedPokemons)
});

function searchByName(pokemonList, pokemonTosearch){
   let pokemonsfilterdByName = pokemonList.filter(pokemon =>{
    return pokemon.name.toLowerCase().includes(pokemonTosearch.toLowerCase()); 
   })
   pokemonListUI.innerHTML = '';
   if(pokemonsfilterdByName.length === 0){
       pokemonListUI.innerHTML = '<h2>No Pokémon Found</h2>';
       console.log('No Pokémon Found');
       return;
   }
   
   updateUI(pokemonsfilterdByName);
}//end of searchByName

// Event Listeners
form.addEventListener('input', (e) => {
    e.preventDefault();
    let pokemonTosearch = e.target.value;
    searchByName(listPokemons, pokemonTosearch);
  
    console.log(pokemonTosearch);
})