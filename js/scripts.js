//IIFE
let pokemonRepository = (function () {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';

    function add(pokemon) {
        if (
            typeof pokemon === "object" &&
            "name" in pokemon &&
            'detailsUrl' in pokemon
        ) {
            pokemonList.push(pokemon);
        } else {
            console.log("pokemon is not correct");
        }
    }

    //Public functions
    function getAll() {
        return pokemonList;
    }

    //Specific Pokemon must only return 1 item
    function getByName(name) {
        const result = pokemonList.filter(function (pokemon) {
            return pokemon.name === name;
        });
        return result.length > 0 ? result[0] : 'This pokemon does not exist...';
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


    //Gets and loads list from pokeapi
    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon);
                console.log(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    //Gets data from item url
    function loadDetails(item) {
        let url = item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            // Adding details to the item
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.weight = details.weight;
            item.types = details.types;
            item.sprites = details.sprites
        }).catch(function (e) {
            console.error(e);
        });
    }

    // // Console logs Pokemon details when clicked
    // function showDetails(item) {
    //     loadDetails(item).then(function () {
    //         showModal(item);
    //     });
    // }

    // function showModal(pokemon) {
    //     modalContainer.innerHTML = '';

    //     let modal = document.createElement('div');
    //     modal.classList.add('modal');

    //     //Adds new modal content
    //     let closeButtonElement = document.createElement('button');
    //     closeButtonElement.classList.add('modal-close');
    //     closeButtonElement.innerText = 'Close';
    //     closeButtonElement.addEventListener('click', hideModal);

    //     let titleElement = document.createElement('h1');
    //     titleElement.innerText = pokemon.name;

    //     let contentElement = document.createElement('p');
    //     contentElement.innerText = 'height: ' + pokemon.height;

    //     let secondContentElement = document.createElement('p');
    //     pokemon.types.forEach((type, index) => {
    //         if (index === pokemon.types.length - 1) {
    //             secondContentElement.innerText += type.type.name;
    //         } else {
    //             secondContentElement.innerText += 'type: ' + type.type.name + ', ';
    //         }
    //     })

    //     let imageElement = document.createElement('img');
    //     imageElement.classList.add('image-class');
    //     imageElement.setAttribute('src', pokemon.imageUrl);

    //     modal.appendChild(closeButtonElement);
    //     modal.appendChild(titleElement);
    //     modal.appendChild(contentElement);
    //     modal.appendChild(secondContentElement);
    //     modal.appendChild(imageElement);
    //     modalContainer.appendChild(modal);

    //     modalContainer.classList.add('is-visible');
    // }

    // function hideModal() {
    //     modalContainer.classList.remove('is-visible');
    // }

    // window.addEventListener('keydown', (e) => {
    //     if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
    //         hideModal();
    //     }
    // });
    // modalContainer.addEventListener('click', (e) => {
    //     // Makes sure to only be triggered when user clicks outside modal container
    //     let target = e.target;
    //     if (target === modalContainer) {
    //         hideModal();
    //     }
    // });

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

//Iterates types and creates elements for name and icon
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

        //Creating wrapper for svg icon scaling
        const typeIconWrapper = document.createElement('div');
        typeIconWrapper.classList.add('icon-wrapper', itm.type.name);

        const typeIconElement = document.createElement('img');
        typeIconElement.src = 'img/types/${itm.type.name}.svg'
        typeIconElement.classList.add('type-svg');

        typeIconWrapper.appendChild(typeIconElement);

        indTypeContainer.appendChild(typeIconWrapper);
        indTypeContainer.appendChild(typeNameElement);
        contentTypes.append(indTypeContainer);
    });
    //Returns type elements to be added
    return contentTypes;
}

//Adds click event to modal to grab Pokemon content
const modalContent = document.querySelector('#pokeModal');

$('#pokeModal').on('show.bs.modal', (event) => {
    let callingButton = event.relatedTarget;
    $('.modal-body').html('');
    //Finds and gets details for targeted Pokemon
    let pokemon = pokemonRepository.getByName(
        callingButton.innerText.toLowerCase()
    );

    let pokemonTypes;

    pokemonRepository.loadDetails(pokemon).then(function () {
        //Adds Pokemon title, imnage and major stats
        $('.modal-title').text(pokemon.name);

        //Setting Pokemon image url
        let spriteUrl;
        if (pokemon.sprites.other['official-artwork'].front_default) {
            spriteUrl = pokemon.sprites.other['official-artwork'].front_default
        } else if (pokemon.sprites.other.home.front_default) {
            spriteUrl = pokemon.sprites.other.home.front_default
        } else {
            spriteUrl = pokemon.imageUrl
        }

        $('.modal-body')
            .append(
                $('<div></div>')
                    .addClass('text-center')
                    .append(
                        $('<img></img>')
                            .attr('src', spriteUrl)
                            .addClass('modal-pokemon-image float-center')
                    )
            )
            .append(
                $('<div></div>')
                    .addClass('text-center pokemon-stats')
                    .append($('<p></p>').text('Height: ${pokemon.height}'))
                    .append($('<p></p>').text('Weight: ${pokemon.weight}'))
            )
    });

    //Adds Pokemon types and images
    pokemonTypes = addTypes(pokemon.types);

    $('.modal-body').append(
        $('<div></div>').addClass('pokemon-type-flex').append(pokemonTypes)
    );
});

//Clears search and re-displays list
function resetSearch() {
    $('.group-list-item').each((index, element) => {
        $(element).show();
    });
    $('input').val('');
}

const searchBar = document.querySelector('#search-button');

//Search and hide non-hits
$('form').on('submit', function (e) {
    e.preventDefault();
    //Gets search value
    const searchVal = $('input').val().toLowerCase();

    if (searchVal === '') {
        alert('Must enter a value to Search');
        resetSearch();
        return;
    }

    $('.group-list-item').each((index, element) => {
        $(element).show();
        if ($(element).text().toLowerCase().indexOf(searchVal) > -1 {
        } else {
            $(element).hide();
        }
    });
});

$('.clear-search').click(() => {
    resetSearch();
});