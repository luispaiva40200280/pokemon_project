// Description: This file contains the script for the Pokemon API project.
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
       
      
    } catch (error) {
        console.error(error);
        
    }
   
}//end

// Display Pokémon Data
function displayPokemonData(pokemonData){
    const {name , types , sprites} = pokemonData;
    return  `<div >
    <div class="card" style="width:11rem" role="button" data-toggle="modal" data-target="#exampleModal">
                <img src="${sprites.front_default}" class="card-img-top" alt="...">
                <div class="card-body text-center">
                    <h5 class ="card-title">${name}</h5>
                    <a class="btn btn btn-sm " id="types">${getTypes(types)} </a> 
                </div>
           </div>
           </div>`
    //end
    
}//end
function getTypes(types){
    let typesArray = [];
    types.forEach(type => {
        typesArray.push(type.type.name);
    });
    return typesArray.join( ' | ');
}
function getDetailPokemonData(pokemonList){
    let promises = pokemonList.map(async pokemon => {
        const pokemonData = pokemon.url;
        const response = await fetch(pokemonData);
        console.log(response);
        return await response.json();
    });

    Promise.all(promises).then(dataArray => {
        dataArray.forEach(data => {
            pokemonListUI.innerHTML += displayPokemonData(data);
            console.log(data);
        });
    });

}//end of the function

// Search functionality by type
function getPokemonsByType(type){
    let selectedType = type;
    filteredPokemons = [];
    pokemonListUI.innerHTML = '';
    let promises = pokemonList.map(async pokemon => {
        const pokemonData = pokemon.url;
        const response = await fetch(pokemonData);
        return await response.json();
    });

    Promise.all(promises).then(dataArray => {
        dataArray.forEach(data => {
            let types = data.types;
            types.forEach(type => {
                if(type.type.name === selectedType){
                    filteredPokemons.push(data.species);
                    pokemonListUI.innerHTML += displayPokemonData(data);
                    //console.log(data);
                }
            });
        });
    });              

    return filteredPokemons;
 }   

// Search functionality by types
pokemonsTypes.addEventListener('change', (e) => {
    e.preventDefault();
    const selectedType = e.target.value;
    getPokemonsByType(selectedType);
    
    console.log(pokemonList);
    console.log(selectedType);
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

function sortPokemons(arr){
    arr.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
    return arr;
}

// Event Listeners
getPokemonData(); 
sortBtn.addEventListener('click', () => {
    pokemonListUI.innerHTML = '';
    pokemonList = sortPokemons(pokemonList);
    console.log(pokemonList);
    getDetailPokemonData(pokemonList);
});


