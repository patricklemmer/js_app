let pokemonRepository = (function () {
    let pokemonList = [];
    // Public functions
    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    // Shows Pokemon name when clicked
    function showDetails(pokemon) {
        console.log(pokemon.name);
    }

    function addListener(button, pokemon) {
        button.addEventListener("click", function () {
            showDetails(pokemon)
        })
    }

    // Adds Pokemon to ul as buttons
    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('button-class');
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
        addListener(button, pokemon);
    }

    return {
        add: add,
        getAll: getAll,
        pokemonList: pokemonList,
        addListItem: addListItem,
        showDetails: showDetails
    };

})();

console.log(pokemonRepository.getAll());

// Adds a Pokemon
pokemonRepository.add({ name: 'Ursaring', height: 5, weight: 277, category: 'hibernator', type: ['normal'] });
console.log(pokemonRepository.getAll());

// forEach function to iterate over Pokemon in pokemonList array
pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon)
});
