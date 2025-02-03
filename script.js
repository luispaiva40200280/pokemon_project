// Description: This file contains the script for the Pokemon API project.

// Variables

/**
 * @poKemon
 * 
 * 
 *
 */

// DOM Elements
const pokemonListUI = document.getElementById('pokemonList');
const searchInput = document.querySelector('#pokemonName');
const searchButton = document.querySelector('#searchButton');
const form = document.querySelector('#searchForm');

let pokemonList = [];
// Fetch Pokémon Data
export async function getPokemonData(){
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=200");
        const data = await response.json();
        pokemonList = data.results;
        console.log(pokemonList);
        console.log(data);
        getDetailPokemonData(pokemonList);
        
    } catch (error) {
        console.error(error);
        
    }
   
}

// Display Pokémon Data
function displayPokemonData(pokemonData){
    const {name , types , sprites} = pokemonData;
    pokemonListUI.innerHTML +=  `<div class="card m-2" style="width: 18rem;">
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
}
function getTypes(types){
    let typesArray = [];
    types.forEach(type => {
        typesArray.push(type.type.name);
    });
    return typesArray.join(', ');
}
function getDetailPokemonData(pokemonList){
    pokemonList.forEach(pokemon => {
        const pokemonData = pokemon.url;
        fetch(pokemonData).then(response => response.json()).then(data => {
            displayPokemonData(data)
           console.log(data);
        });
    });
}

getPokemonData();
// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form Submitted');
})