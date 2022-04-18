//IIFE
let pokemonRepository = (function () {
    let pokemonList = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=151';
    let modalContainer = document.querySelector('#modal-container');

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

    function addListItem(pokemon) {
        let pokemonList = document.querySelector(".pokemon-list");
        let listpokemon = document.createElement("li");
        let button = document.createElement("button");
        button.innerText = pokemon.name;
        button.classList.add("button-class");
        listpokemon.appendChild(button);
        listpokemon.classList.add("list-group-item");
        pokemonList.appendChild(listpokemon);
        button.addEventListener("click", function (event) {
            showDetails(pokemon);
        });
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
            item.types = details.types;
        }).catch(function (e) {
            console.error(e);
        });
    }

    // Console logs Pokemon details when clicked
    function showDetails(item) {
        loadDetails(item).then(function () {
            showModal(item);
        });
    }

    function showModal(pokemon) {
        modalContainer.innerHTML = '';

        let modal = document.createElement('div');
        modal.classList.add('modal');

        //Adds new modal content
        let closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'Close';
        closeButtonElement.addEventListener('click', hideModal);

        let titleElement = document.createElement('h1');
        titleElement.innerText = pokemon.name;

        let contentElement = document.createElement('p');
        contentElement.innerText = 'height: ' + pokemon.height;

        let secondContentElement = document.createElement('p');
        pokemon.types.forEach((type, index) => {
            if (index === pokemon.types.length - 1) {
                secondContentElement.innerText += type.type.name;
            } else {
                secondContentElement.innerText += 'type: ' + type.type.name + ', ';
            }
        })

        let imageElement = document.createElement('img');
        imageElement.classList.add('image-class');
        imageElement.setAttribute('src', pokemon.imageUrl);

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modal.appendChild(secondContentElement);
        modal.appendChild(imageElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');
    }

    function hideModal() {
        modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });
    modalContainer.addEventListener('click', (e) => {
        // Makes sure to only be triggered when user clicks outside modal container
        let target = e.target;
        if (target === modalContainer) {
            hideModal();
        }
    });

    return {
        add: add,
        getAll: getAll,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showDetails: showDetails,
        showModal: showModal,
        hideModal: hideModal
    };
})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});