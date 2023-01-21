
const api = {}

function convertToMyModel(pokeDetails='',speciesDetails = ''){
    const pokemon = new Pokemon()
    
    if(pokeDetails!== ''){
        pokemon.name = pokeDetails.name
        pokemon.id = pokeDetails.id

        if(pokeDetails.id <= 649){
            pokemon.image = pokeDetails.sprites.other.dream_world.front_default
        }else{
            pokemon.image = pokeDetails.sprites.other['official-artwork'].front_default
        }
        

        const types = pokeDetails.types.map(typeSlot => typeSlot.type.name)
        const [type] = types
        
        pokemon.types = types
        pokemon.type = type

        pokemon.height = pokeDetails.height/10
        pokemon.weight = pokeDetails.weight/10
        const abilities = pokeDetails.abilities.map(abilitiesSlot=> abilitiesSlot.ability.name)
        pokemon.abilities = abilities

        const stats = pokeDetails.stats.map(statSlot => statSlot.base_stat)
        pokemon.stats = stats

        const moves = pokeDetails.moves.map(moveSlot => moveSlot.move.name)
        pokemon.moves = moves

        const moveLvl = pokeDetails.moves.map(moveSlot => moveSlot.version_group_details[0].level_learned_at)
        pokemon.moveLvl = moveLvl

        const moveMethod = pokeDetails.moves.map(moveSlot => moveSlot.version_group_details[0].move_learn_method.name)
        pokemon.moveMethod = moveMethod
    }

    // Species info
    if(speciesDetails !== ''){
        
        speciesDetails.habitat?.name ? pokemon.habitat = speciesDetails.habitat.name : pokemon.habitat = 'unknown'
        const eggGroup = speciesDetails.egg_groups?.map(group => group.name)
        pokemon.eggGroup = eggGroup
        

        for (let i = 0; i < speciesDetails.flavor_text_entries.length - 1; i++) {
            if (speciesDetails.flavor_text_entries[i].language.name === "en") {
                pokemon.aboutText = speciesDetails.flavor_text_entries[i].flavor_text;
                break;
            }
        }

        for (let i = 0; i < speciesDetails.genera.length - 1; i++) {
            if (speciesDetails.genera[i].language.name === "en") {
                pokemon.species = speciesDetails.genera[i].genus
                break;
            }
        }

        switch (speciesDetails.gender_rate) {
            case 0:
                pokemon.genderRate = `<p>100% <i class="fa-solid fa-mars"></i></p><p> 0% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 1:
                pokemon.genderRate = `<p>87.5% <i class="fa-solid fa-mars"></i></p><p>  12.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 2:
                pokemon.genderRate = `<p>75% <i class="fa-solid fa-mars"></i></p><p>  25% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 3:
                pokemon.genderRate = `<p>62.5% <i class="fa-solid fa-mars"></i></p><p>  37.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 4:
                pokemon.genderRate = `<p>50% <i class="fa-solid fa-mars"></i></p><p>  50% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 5:
                pokemon.genderRate = `<p>37.5% <i class="fa-solid fa-mars"></i></p><p>  62.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 6:
                pokemon.genderRate = `<p>25% <i class="fa-solid fa-mars"></i></p><p>  75% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 7:
                pokemon.genderRate = `<p>12.5% <i class="fa-solid fa-mars"></i></p><p>  87.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 8:
                pokemon.genderRate = `<p>0% <i class="fa-solid fa-mars"></i></p><p>  100% <i class="fa-solid fa-venus"></i></i></p>`
                break
            default:
                pokemon.genderRate = `<p>Unknown</p>`
        }
        //pokemon.evolutionChain = speciesDetails.evolution_chain.url
    }
    
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

api.getPokemonInfo = (id) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    return fetch(url)
        .then((response) => response.json())
        .then(data => convertToMyModel(data,''))
}

api.getSpeciesInfo = (id) => {

    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    return fetch(url)
        .then((response) => response.json())
        .then(data => convertToMyModel('',data))
}
