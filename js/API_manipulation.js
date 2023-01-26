const api = {}

function convertToMyModel(pokeDetails='',speciesDetails = ''){
    const poke = new Pokemon()
    
    if(pokeDetails!== ''){
        poke.name = pokeDetails.name
        poke.id = pokeDetails.id

        
        //poke.image = pokeDetails.sprites.other['official-artwork'].front_default
        if(pokeDetails.id<650){
            poke.image = pokeDetails.sprites.other.dream_world.front_default
        }else{
            poke.image = pokeDetails.sprites.other['official-artwork'].front_default
        }
        
        

        const types = pokeDetails.types.map(typeSlot => typeSlot.type.name)
        const [type] = types
        
        poke.types = types
        poke.type = type

        poke.height = pokeDetails.height/10
        poke.weight = pokeDetails.weight/10
        const abilities = pokeDetails.abilities.map(abilitiesSlot=> abilitiesSlot.ability.name)
        poke.abilities = abilities

        const stats = pokeDetails.stats.map(statSlot => statSlot.base_stat)
        poke.stats = stats

        const moves = pokeDetails.moves.map(moveSlot => moveSlot.move.name)
        poke.moves = moves

        const moveLvl = pokeDetails.moves.map(moveSlot => moveSlot.version_group_details[0].level_learned_at)
        poke.moveLvl = moveLvl

        const moveMethod = pokeDetails.moves.map(moveSlot => moveSlot.version_group_details[0].move_learn_method.name)
        poke.moveMethod = moveMethod
    }

    // Species info
    if(speciesDetails !== ''){
        
        speciesDetails.habitat?.name ? poke.habitat = speciesDetails.habitat.name : poke.habitat = 'unknown'
        const eggGroup = speciesDetails.egg_groups?.map(group => group.name)
        poke.eggGroup = eggGroup
        

        for (let i = 0; i < speciesDetails.flavor_text_entries.length - 1; i++) {
            if (speciesDetails.flavor_text_entries[i].language.name === "en") {
                poke.aboutText = speciesDetails.flavor_text_entries[i].flavor_text;
                break;
            }
        }

        for (let i = 0; i < speciesDetails.genera.length - 1; i++) {
            if (speciesDetails.genera[i].language.name === "en") {
                poke.species = speciesDetails.genera[i].genus
                break;
            }
        }

        switch (speciesDetails.gender_rate) {
            case 0:
                poke.genderRate = `<p>100% <i class="fa-solid fa-mars"></i></p><p> 0% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 1:
                poke.genderRate = `<p>87.5% <i class="fa-solid fa-mars"></i></p><p>  12.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 2:
                poke.genderRate = `<p>75% <i class="fa-solid fa-mars"></i></p><p>  25% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 3:
                poke.genderRate = `<p>62.5% <i class="fa-solid fa-mars"></i></p><p>  37.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 4:
                poke.genderRate = `<p>50% <i class="fa-solid fa-mars"></i></p><p>  50% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 5:
                poke.genderRate = `<p>37.5% <i class="fa-solid fa-mars"></i></p><p>  62.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 6:
                poke.genderRate = `<p>25% <i class="fa-solid fa-mars"></i></p><p>  75% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 7:
                poke.genderRate = `<p>12.5% <i class="fa-solid fa-mars"></i></p><p>  87.5% <i class="fa-solid fa-venus"></i></i></p>`
                break
            case 8:
                poke.genderRate = `<p>0% <i class="fa-solid fa-mars"></i></p><p>  100% <i class="fa-solid fa-venus"></i></i></p>`
                break
            default:
                poke.genderRate = `<p>Unknown</p>`
        }
        //pokemon.evolutionChain = speciesDetails.evolution_chain.url
    }

    return poke
}

api.getPokemonDetails = async pokemon => {    //Pegando detalhes de cada pokémon
    const response = await fetch(pokemon.url)
    const pokeDetails = await response.json()
    return convertToMyModel(pokeDetails)
}

api.getPokemonList = async (offset = 0,limit = 20) => {   //Pegando lista dos pokémon
    
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    
    const response = await fetch(url)
    const json = await response.json()
    const pokemonList = json.results
    const detailRequests = pokemonList.map(api.getPokemonDetails)
    const pokemonDetails = await Promise.all(detailRequests)
    return pokemonDetails
}

api.getPokemonInfo = async (id) => {

    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;

    const response = await fetch(url)
    const data = await response.json()
    return convertToMyModel(data, '')
}

api.getSpeciesInfo = async (id) => {

    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`;

    const response = await fetch(url)
    const data = await response.json()
    return convertToMyModel('', data)
}

api.searchBar = async () => {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=890&offset=0`;

    const response = await fetch(url)
    const json = await response.json()
    const pokemonList = json.results
    return pokemonList.map(names=> names.name)
}

