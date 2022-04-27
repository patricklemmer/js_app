//Checks to see if Pokemon being added is an object
function validatePokemon(pokemon) {
    return typeof pokemon === 'object' ? true : false;
}

//Checks to see if object has three keys that match Pokemon object
function validatePokemonKeys(pokemon) {
    const validKeys = ['name', 'height', 'types'];
    //confirming correct number of keys if not 3 end
    if (Object.keys(pokemon).length !== 3) {
        return false;
    }
    //Confirming keys are in validKeys if any are not present return false
    const containsAllKeys = Object.keys(pokemon).every(function (k) {
        return validKeys.includes(k);
    });

    return containsAllKeys;
}

//IIFE
let pokemonRepository = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function add(pokemon) {
        if (validatePokemon(pokemon)) {
            pokemonList.push(pokemon);
        }
        //removed extra validation for now
        // if (validatePokemon(pokemon) && validatePokemonKeys(pokemon)) {
        //   pokemonList.push(pokemon);
        // } else {
        //   return;
        // }
    }

    function getAll() {
        return pokemonList;
    }
    function getByName(name) {
        //Finds specific Pokemon must only return one item
        const result = pokemonList.filter(function (pokemon) {
            return pokemon.name === name;
        });
        return result.length > 0 ? result[0] : 'This pokemon does not exist..';
    }

    function addListItem(pokemon) {
        $('.list-group').append(
            $('<li></li>')
                .addClass('group-list-item col-lg-4 col-sm-12 col-md-6')
                .append(
                    $('<button></button>')
                        .append(document.createTextNode(pokemon.name)).addClass('btn btn-light')
                        .attr('data-toggle', 'modal')
                        .attr('data-target', '#pokeModal')
                )
        );
    }

    function loadList() {
        return fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                json.results.forEach(function (item) {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url,
                    };
                    add(pokemon);
                });
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (details) {
                item.imageUrl = details.sprites.front_default;
                item.height = details.height;
                item.weight = details.weight;
                item.types = details.types;
                item.sprites = details.sprites
            })
            .catch(function (e) {
                console.error(e);
            });
    }

    return {
        add: add,
        getAll: getAll,
        getByName: getByName,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
    };
})();

//Gets full list of Pokemon from API
pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});

//Iterates types and makes elements for name and icon
function addTypes(types) {
    let contentTypes = $('<div></div>').addClass(
        'modal-type-wrapper text-center'
    );

    types.forEach((itm) => {
        const indTypeContainer = document.createElement('div');
        indTypeContainer.classList.add('type-container');

        const typeNameElement = document.createElement('p');
        typeNameElement.classList.add('type-name');
        typeNameElement.innerText = itm.type.name;

        //creating a wrapper to scale svg icons
        const typeIconWrapper = document.createElement('div');
        typeIconWrapper.classList.add('icon-wrapper', itm.type.name);

        const typeIconElement = document.createElement('img');
        typeIconElement.src = `./assets/types/${itm.type.name}.svg`;
        typeIconElement.classList.add('type-svg');

        typeIconWrapper.appendChild(typeIconElement);

        indTypeContainer.appendChild(typeIconWrapper);
        indTypeContainer.appendChild(typeNameElement);
        contentTypes.append(indTypeContainer);
    });
    //Returns type elements to be added
    return contentTypes;
}

//Adds click event onto modal to grab Pokemon content
const modalContent = document.querySelector('#pokeModal');

$('#pokeModal').on('show.bs.modal', (event) => {
    let callingButton = event.relatedTarget;
    $('.modal-body').html('');
    //Finds and pulls details for targeted Pokemon
    let pokemon = pokemonRepository.getByName(
        callingButton.innerText.toLowerCase()
    );

    let pokemonTypes;

    pokemonRepository.loadDetails(pokemon).then(function () {
        //add Pokemon Title, image and major Stats
        $('.modal-title').text(pokemon.name);

        //Sets Pokemon image URL, trying official and home then defaulting
        let spriteURL;
        if (pokemon.sprites.other['official-artwork'].front_default) {
            spriteURL = pokemon.sprites.other['official-artwork'].front_default
        } else if (pokemon.sprites.other.home.front_default) {
            spriteURL = pokemon.sprites.other.home.front_default
        } else {
            spriteURL = pokemon.imageUrl
        }

        $('.modal-body')
            .append(
                $('<div></div>')
                    .addClass('text-center')
                    .append(
                        $('<img></img>')
                            .attr('src', spriteURL)
                            .addClass('modal-pokemon-image float-center')
                    )
            )
            .append(
                $('<div></div>')
                    .addClass('text-center pokemon-stats')
                    .append($('<p></p>').text(`Height: ${pokemon.height}`))
                    .append($('<p></p>').text(`Weight: ${pokemon.weight}`))
            );

        //Adds Pokemon types and images
        pokemonTypes = addTypes(pokemon.types);

        $('.modal-body').append(
            $('<div></div>').addClass('pokemon-type-flex').append(pokemonTypes)
        );
    });
});

//Clears search and re-displays list
function resetSearch() {
    $('.group-list-item').each((index, element) => {
        $(element).show();
    });
    $('input').val('');
}

const searchBar = document.querySelector('#search-button');

//Searches and hides non-hits
$('form').on('submit', function (e) {
    e.preventDefault();
    //Gets search value
    const searchVal = $('input').val().toLowerCase();

    if (searchVal === '') {
        alert('Please enter a Pokemon name to search');
        resetSearch();
        return;
    }

    $('.group-list-item').each((index, element) => {
        $(element).show();
        if ($(element).text().toLowerCase().indexOf(searchVal) > -1) {
        } else {
            $(element).hide();
        }
    });
});

$('.clear-search').click(() => {
    resetSearch();
});