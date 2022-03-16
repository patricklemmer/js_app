let pokemonList = [
    {name: 'Charizard', height: 5, weight: 199 , category: 'flame' , type: ['fire', 'flying']},
    {name: 'Noctowl', height: 5, weight: 89 , category: 'owl' , type: ['normal', 'flying']},
    {name: 'Tauros', height: 4, weight: 194 , category: 'wild bull' , type: ['normal']},
    {name: 'Torterra', height: 7, weight: 683 , category: 'continent' , type: ['grass', 'ground']},
    {name: 'Squirtle', height: 1, weight: 19 , category: 'tiny turtle' , type: ['water']},
    {name: 'Jolteon', height: 2, weight: 54 , category: 'lightning' , type: ['electric']}
];

for (let i=0; i < pokemonList.length; i++) {
    document.write(`${pokemonList[i].name}, height: ${pokemonList[i].height}`);
}
