// Description: This file contains the script for the Pokemon API project.

// Variables

// DOM Elements
const pokemonListUI = document.getElementById('pokemonList');
const searchInput = document.querySelector('#pokemonName');
const searchButton = document.querySelector('#searchButton');
const form = document.querySelector('#searchForm');
const sortBtn = document.getElementById('sort-btn');
const pokemonsTypes = document.querySelector('#pokemonType');

let pokemonList = [];
// Fetch Pokémon Data
async function getPokemonData(){
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150");
        const data = await response.json();
        pokemonList = data.results;
        //console.log(pokemonList);
        //console.log(data);
        getDetailPokemonData(pokemonList);
        sortBtn.addEventListener("click",()=>{
            pokemonList.sort((a,b) => a.name.localeCompare(b.name));
            pokemonListUI.innerHTML = '';
            getDetailPokemonData(pokemonList);
        })
      
    } catch (error) {
        console.error(error);
        
    }
   
}//end

// Display Pokémon Data
function displayPokemonData(pokemonData){
    const {name , types , sprites} = pokemonData;
    return  `<div class="card m-2" style="width: 18rem;">
                            <img src="${sprites.front_default}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${name}</h5>
                                <p class="card-text">${getTypes(types)}</p>
                                <a href="#" class="btn btn-primary">Details</a>
                            </div>
                            <div class="card-footer">
                                <small class="text-muted">Last updated 3 mins ago</small>
                            </div>
                        </div>`
    //end
    
}//end
function getTypes(types){
    let typesArray = [];
    types.forEach(type => {
        typesArray.push(type.type.name);
    });
    return typesArray.join(', ');
}
function getDetailPokemonData(pokemonList){
    let PokemonListDetail = [];
    let promises = pokemonList.map(pokemon => {
        const pokemonData = pokemon.url;
        return fetch(pokemonData).then(response => response.json());
    });

    Promise.all(promises).then(dataArray => {
        dataArray.forEach(data => {
            PokemonListDetail.push(data);
            pokemonListUI.innerHTML += displayPokemonData(data);
        });
    });

    return PokemonListDetail;
}//end of the function

// Search functionality by types
pokemonsTypes.addEventListener('change', async (e) => {
    e.preventDefault();
    const selectedType = e.target.value;
    if (selectedType === ''){
        pokemonListUI.innerHTML = '';
        getDetailPokemonData(pokemonList);
        return;
    }
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
        const data = await response.json();
        const poketType = data.pokemon;
        pokemonListUI.innerHTML = ''; // remove all the previous data
        poketType.forEach(pokemon => {
            const pokemonData = pokemon.pokemon.url;
            if (pokemonData) {
                fetch(pokemonData).then(response => response.json()).then(data => {
                    pokemonListUI.innerHTML += displayPokemonData(data);
                    
                    
                }).catch(error => {
                    console.error('Error fetching pokemon data:', error);
                });
            } else {
                console.error('Invalid URL:', pokemonData);
            }
        });
        
        console.log(data);
        console.log(poketType);
             
    } catch (error) {
        console.error('Error fetching type data:', error);
    }
    
    console.log(e.target.value);
});
//search POKEMON BY NAME OR ID
function searchByName(pokemonList, pokemonTosearch){
    
    if (pokemonTosearch === ''){
        pokemonListUI.innerHTML = '';
        getDetailPokemonData(pokemonList);
        return;
    }
    let filteredPokemons = pokemonList.filter(pokemon => {
        return pokemon.name.toLowerCase().includes(pokemonTosearch) || pokemon.url.split('/')[6].includes(pokemonTosearch);
    }); 
    pokemonListUI.innerHTML = '';
    getDetailPokemonData(filteredPokemons);
    if(filteredPokemons.length === 0){
        pokemonListUI.innerHTML = '<h2>No Pokémon Found</h2>';
        console.log('No Pokémon Found');
        return;
    }

    console.log(pokemonTosearch);
    console.log(filteredPokemons);
    
}//end of searchByName

// Event Listeners
form.addEventListener('input', (e) => {
    e.preventDefault();
    let pokemonTosearch = e.target.value;
    searchByName(pokemonList, pokemonTosearch);

    console.log(pokemonTosearch);
})

// sort button
/* sortBtn.addEventListener('click', () => {
    console.log('Sort Button Clicked');
}) */


getPokemonData();


