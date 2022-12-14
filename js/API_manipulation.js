
const api = {}

function convertToMyModel(details){
    const pokemon = new Pokemon()
    pokemon.name = details.name
    pokemon.id = details.id

    if(details.id <= 649){
        pokemon.image = details.sprites.other.dream_world.front_default
    }else{
        pokemon.image = details.sprites.front_default
    }
    

    const types = details.types.map(typeSlot => typeSlot.type.name)
    const [type] = types
    
    pokemon.types = types
    pokemon.type = type

    pokemon.height = details.height/10
    pokemon.weight = details.weight/10

    const stats = details.stats.map(statSlot => statSlot.base_stat)
    pokemon.stats = stats

    return pokemon
}

api.getPokemonDetails = pokemon => {    //Pegando detalhes de cada pokémon
    return fetch(pokemon.url)
        .then(response => response.json())
        .then(convertToMyModel)
}

api.getPokemonList = (offset = 0,limit = 20) => {   //Pegando lista dos pokémon
    
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
    return fetch(url)
        .then( response => response.json())
        .then(json => json.results)
        .then((pokemonList) => pokemonList.map(api.getPokemonDetails))
        .then(detailRequests => Promise.all(detailRequests))
        .then(pokemonDetails => pokemonDetails)
}

api.getPokemonById = (id) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return fetch(url)
        .then((response) => response.json())
        .then(convertToMyModel)
}