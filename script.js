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
    let PokemonListDatail = []
    pokemonList.forEach(pokemon => {
        const pokemonData = pokemon.url;
        fetch(pokemonData).then(response => response.json()).then(data => {
            PokemonListDatail.push(data)
            pokemonListUI.innerHTML += displayPokemonData(data)
             
        });
    });
   return PokemonListDatail
}//end of the funcion
// Search functionality by types


pokemonsTypes.addEventListener('change', (e) => {
    e.preventDefault();
    const selectedType = e.target.value;
    if (selectedType === ''){
        pokemonListUI.innerHTML = '';
        getDetailPokemonData(pokemonList);
        return;
    }
    fetch(`https://pokeapi.co/api/v2/type/${selectedType}`).then(response => response.json()).then(data => {
       const poketType = data.pokemon
       poketType.forEach(pokemon =>{
        const pokemonData = pokemon.pokemon.url
        fetch(pokemonData).then(response => response.json()).then(data => {
            pokemonListUI.innerHTML = ''
            pokemonListUI.innerHTML += displayPokemonData(data)
             
        });
    
       })
        console.log(data)
        console.log(poketType)
         
    });
    console.log(e.target.value);
    
}) 

// Event Listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form Submitted');
})




getPokemonData();