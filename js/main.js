const insertPokemonLi = document.getElementById('pokemon-list')
const paginationBtn = document.getElementById('pagination-btn')
const limit = 10
let offset = 0


function pokemonListToLi(pokemon){
    return `
    <li class="pokemon-details ${pokemon.type}">
        <span class="pokemon-name">${pokemon.name}</span> 
        <span class="pokemon-id">#${pokemon.id}</span>
        <img src="${pokemon.image}" alt="imagem do pokemon ${pokemon.name}">
        <ol class="pokemon-types">
            ${pokemon.types.map( type => `<li class="${type}">${type}</li>`).join('')}
        </ol>
    </li>
    `
}

function loadMorePokemon(offset,limit){     //função para carregar mais pokemon
    api.getPokemonList(offset,limit).then( (pokemonList = []) => {
        insertPokemonLi.innerHTML += pokemonList.map( pokemon => `
            <li class="pokemon-details ${pokemon.type}">
                <span class="pokemon-name">${pokemon.name}</span> 
                <span class="pokemon-id">#${pokemon.id}</span>
                <img src="${pokemon.image}" alt="imagem do pokemon ${pokemon.name}">
                <ol class="pokemon-types">
                    ${pokemon.types.map( type => `<li class="${type}">${type}</li>`).join('')}
                </ol>
            </li>
        `).join('')
    })
}

loadMorePokemon(offset,limit)

 paginationBtn.addEventListener('click', () => {
    offset+=limit
    loadMorePokemon(offset,limit)
 })