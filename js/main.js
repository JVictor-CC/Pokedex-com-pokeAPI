const insertPokemonLi = document.getElementById('pokemon-list')
const paginationBtn = document.getElementById('pagination-btn')
const paginationBtnParent = document.querySelector('.pagination')
const limit = 20
let offset = 0
const generation = [0,151,251,386,493,649,721,809,890] //8 gerações, até a 5 com as imagens corretas
var pokemonLimiter = generation[8]

const gen = document.querySelector('#generation')
const filterBtn = document.querySelector('#filter-btn')


function pokemonListToLi(pokemon){
    return `
    <li class="pokemon-details ${pokemon.type}" onclick="showDetails('${pokemon.id}')">
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
        updateList = pokemonList.map( pokemon => pokemonListToLi(pokemon)).join('')
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
    paginationBtnParent.appendChild(paginationBtn)

    if(gen.value == 9){
        offset = 0
        pokemonLimiter = generation[8]
        loadMorePokemon(offset,limit,1)
    }else{
        offset = generation[gen.value-1]
        pokemonLimiter = generation[gen.value]
        loadMorePokemon(offset,limit,1)
    }
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



const pokemonDetailsToggle = () => {
    document.querySelector('#details-overlay').classList.toggle('toggle-details');
}

// show details of a specific pokemon
const showDetails = (id) => {
    api.getPokemonById(id)
        .then((details) => {
            pokemonDetailsToggle()
            
            const detailsBox = document.getElementById('details-overlay')
            updateHtml = `
            <div id="details-page" class="${details.type}">
                <button type="button" onclick="pokemonDetailsToggle()">X</button>
                <h2 class="pokemon-name">${details.name}</h2> 
                <span class="pokemon-id">#${details.id}</span>
                <img src="${details.image}" alt="imagem do pokemon ${details.name}">
                <div class="details-info">
                    <div class="stats">
                        <h3>stats</h3>
                        <table>
                            <tr>
                                <td>HP</td>
                                <td>${details.stats[0]}</td>
                            </tr>
                            <tr>
                                <td>Attack</td>
                                <td>${details.stats[1]}</td>
                            </tr>
                            <tr>
                                <td>Defense</td>
                                <td>${details.stats[2]}</td>
                            </tr>
                            <tr>
                                <td>Special Attack</td>
                                <td>${details.stats[3]}</td>
                            </tr>
                            <tr>
                                <td>Special Defense</td>
                                <td>${details.stats[4]}</td>
                            </tr>
                            <tr>
                                <td>Speed</td>
                                <td>${details.stats[5]}</td>
                            </tr>
                      </table>
                    </div>
                </div>
            </div>`
            detailsBox.innerHTML = updateHtml
            
        });
}