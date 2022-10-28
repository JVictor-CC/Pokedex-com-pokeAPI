const insertPokemonLi = document.getElementById('pokemon-list')
const paginationBtn = document.getElementById('pagination-btn')
const limit = 20
let offset = 0
const generation = [0,151,251,386,493,649,721,809,890] //8 gerações, até a 5 com as imagens corretas
var pokemonLimiter = generation[8]

const gen = document.querySelector('#generation')
const filterBtn = document.querySelector('#filter-btn')


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

function loadMorePokemon(offset,limit, reload = 0){     //função para carregar mais pokemon
    api.getPokemonList(offset,limit).then( (pokemonList = []) => {
        updateList = pokemonList.map( pokemon => `
            <li class="pokemon-details ${pokemon.type}">
                <span class="pokemon-name">${pokemon.name}</span> 
                <span class="pokemon-id">#${pokemon.id}</span>
                <img src="${pokemon.image}" alt="imagem do pokemon ${pokemon.name}">
                <ol class="pokemon-types">
                    ${pokemon.types.map( type => `<li class="${type}">${type}</li>`).join('')}
                </ol>
            </li>
            `).join('')
        if(reload == 0){
            insertPokemonLi.innerHTML += updateList
        }else{
            insertPokemonLi.innerHTML = updateList
        }
        
    })
}

loadMorePokemon(offset,limit)


filterBtn.onclick = (event) => {
    event.preventDefault();
    offset = generation[gen.value-1]
    pokemonLimiter = generation[gen.value]
    loadMorePokemon(offset,limit,1)
};


paginationBtn.addEventListener('click', () => {
    offset+=limit

    const nextPage = offset+limit
    if(nextPage >= pokemonLimiter){
        const newLimit = pokemonLimiter - offset
        loadMorePokemon(offset,newLimit)
        paginationBtn.parentElement.removeChild(paginationBtn)
    }else{
        loadMorePokemon(offset,limit)
    }
    
})