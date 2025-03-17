// DOM Elements
const pokemonListUI = document.getElementById('pokemonList');
const pokemonsTypes = document.querySelector('#pokemonType');
const form = document.querySelector('#searchForm');
const sortBtn = document.getElementById('sort-btn');

// Fetch data of Pokemons
let listPokemons = [];
let filteredPokemons = [];

async function getPokemons(){
    try {
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
        console.log(listPokemons);
        
        return listPokemons;
    }catch(err) {
        console.error(err);
        clearInterval(dotAnimation);
    }

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
    const {name , types , sprites , id} = pokemonData;
    return  `
                    <div class="card" type="buttton"  style="width:11rem" value="${name}" role="button" id="${id}" data-bs-toggle="modal" data-bs-target="#pokemonDetailsModal">
                        <img src="${sprites?.front_default ?? null } " class="card-img-top" alt="...">
                        <div class="card-body text-center">
                             <h5 class ="card-title"><span>#${id}</span> ${name}</h5>
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

    function attachCardListeners() {
        const cards = document.querySelectorAll('.card');
        
        cards.forEach(card => {
            card.addEventListener('click', function () {
                const pokemonId = this.getAttribute("id");
                const pokemon = listPokemons.find(p => p.id == pokemonId);
                
                if (pokemon) {
                    displayDetails(pokemon);
                }
            });
        });
    }
     
    attachCardListeners();
}
getPokemons().then(listPokemons => {
    // Display data of Pokemons
    updateUI(listPokemons)
}); 

// Search functionality by type
function getPokemonsByType(type){
    filteredPokemons =  listPokemons.filter(pokemon => {
        // If no type is selected, return all Pokemons. Else, return only Pokemons with the selected type.  //
       return type === '' ? pokemon : pokemon.types.some(pokemonType => 
                pokemonType.type.name === type);
        
    });
    console.log(listPokemons)
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
    const sortedPokemons = sortPokemons(filteredPokemons);
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

/* scroll up  */


/* scroll up star */
function upscrollfuncion(){
    document.documentElement.scrollTop -= 200; // how much you want to scroll
    if (document.documentElement.scrollTop > 0) {
        setTimeout(upscrollfuncion, 55);
    }  
} ;


document.getElementById("scrollUP").addEventListener("click",  function() { 
    upscrollfuncion()

});
 /* scroll up end  */
 // display details from pokemon 
 
 

 function displayDetails(pokemon) {
    const { name, types, sprites, id, height, weight } = pokemon;
    const modalContent = document.getElementById("pokemonDetailsContent");
    
    modalContent.innerHTML = `
        <div class="text-center">
            <img src="${sprites?.front_default}" alt="${name}" class="img-fluid mb-3">
            <h4>#${id} ${name}</h4>
            <p><strong>Types:</strong> ${getTypes(types)}</p>
            <p><strong>Height:</strong> ${height / 10} m</p>
            <p><strong>Weight:</strong> ${weight / 10} kg</p>
        </div>
    `;

    // Abrir o modal com Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('pokemonDetailsModal'));
    modal.show();
}