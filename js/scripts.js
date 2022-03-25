let pokemonRepository = (function () {
    let pokemonList = [
        {
            name: 'Charizard',
            height: 5, weight: 199,
            category: 'flame',
            type: ['fire', 'flying']
        },
        {
            name: 'Noctowl',
            height: 5,
            weight: 89,
            category: 'owl',
            type: ['normal', 'flying']
        },
        {
            name: 'Tauros',
            height: 4,
            weight: 194,
            category: 'wild bull',
            type: ['normal']
        },
        {
            name: 'Torterra',
            height: 7,
            weight: 683,
            category: 'continent',
            type: ['grass', 'ground']
        },
        {
            name: 'Squirtle',
            height: 1,
            weight: 19,
            category: 'tiny turtle',
            type: ['water']
        },
        {
            name: 'Jolteon',
            height: 2,
            weight: 54,
            category: 'lightning',
            type: ['electric']
        }
    ]
    // Public functions
    function add(pokemon) {
        pokemonList.push(pokemon);
    }

    function getAll() {
        return pokemonList;
    }

    return {
        add: add,
        getAll: getAll,
        pokemonList: pokemonList
    };

})();

console.log(pokemonRepository.getAll());

// Adds a Pokemon
pokemonRepository.add({ name: 'Ursaring', height: 5, weight: 277, category: 'hibernator', type: ['normal'] });
console.log(pokemonRepository.getAll());

// forEach function to iterate over Pokemon in pokemonList array
function pokemonFunction(pokemon) {
    document.write("<p>" + pokemon.name + ' is ' + pokemon.height + ' ft tall.' + "</p>");
}

pokemonRepository.pokemonList.forEach(pokemonFunction);
