const insertPokemonLi = document.getElementById('pokemon-list')
const paginationBtn = document.getElementById('pagination-btn')
const paginationBtnParent = document.querySelector('.pagination')
const limit = 20
let offset = 0
const generation = [0,151,251,386,493,649,721,809,890] //8 gerações
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
    api.getPokemonInfo(id)
        .then((details) => {
            pokemonDetailsToggle()
            
            type = details.type

            const detailsBox = document.getElementById('details-overlay')
            updateHtml = `
            <div id="details-page" class="${type}">
                <button class="back-btn" type="button" onclick="pokemonDetailsToggle()"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="pokemon-name">${details.name}</h2> 
                <span class="pokemon-id">#${details.id}</span>
                <img src="${details.image}" alt="imagem do pokemon ${details.name}">
                <ol class="pokemon-types">
                    ${details.types.map( type => `<li class="${type}">${type}</li>`).join('')}
                </ol>
                <div class="details-info">
                    <ul>
                        <li>
                            <input type="radio" checked="true" name="tabs" id="about" class="detail-tabs">
                            <label for="about">About</label>
                            <div class="tab-content">
                                <div class="infos" id="about-info">
                                
                                    
                                <div/>
                            </div>
                        </li>
                        <li>
                            <input type="radio" name="tabs" id="base-stats" class="detail-tabs">
                            <label for="base-stats">Base Stats</label>
                            <div class="tab-content">
                                <div class="infos">
                                    <h3>Stats</h3>
                                    <table class="stats-tb">
                                        <tr>
                                            <td>HP</td>
                                            <td class="${type}">${details.stats[0]}</td>
                                        </tr>
                                        <tr>
                                            <td>Attack</td>
                                            <td class="${type}">${details.stats[1]}</td>
                                        </tr>
                                        <tr>
                                            <td>Defense</td>
                                            <td class="${type}">${details.stats[2]}</td>
                                        </tr>
                                        <tr>
                                            <td>Special Attack</td>
                                            <td class="${type}">${details.stats[3]}</td>
                                        </tr>
                                        <tr>
                                            <td>Special Defense</td>
                                            <td class="${type}">${details.stats[4]}</td>
                                        </tr>
                                        <tr>
                                            <td>Speed</td>
                                            <td class="${type}">${details.stats[5]}</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </li>
                        <li>
                            <input type="radio" name="tabs" id="moves" class="detail-tabs">
                            <label for="moves">Moves</label>
                            <div class="tab-content">
                                <table class="moves-tb">
                                    <tr>
                                        <th>Move</th>
                                        <th>Level</th>
                                        <th>Method</th>
                                    </tr>

                                    ${details.moves.map((move, moveIncrement=0) => `
                                        <tr>
                                            <td>${move}</td>
                                            <td class="${type}">${details.moveLvl[moveIncrement]}</td>
                                            <td class="${type}">${details.moveMethod[moveIncrement++]}</td>
                                        </tr>
                                    `).join('')}
                                    
                                </table>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>`
            detailsBox.innerHTML = updateHtml


            aux = `
                <tr>
                    <td>Height</td>
                    <td class="${type}">${details.height} m</td>
                </tr>
                <tr>
                    <td>Weight</td>
                    <td class="${type}">${details.weight} kg</td>
                </tr>
                <tr>
                    <td>Abilities</td>
                    <td class="${type}">${details.abilities.map(ability => `<p>${ability}</p>`).join('')}</td>
                </tr>
            `

            return api.getSpeciesInfo(id)

        })
        .then(sepeciesDetails => {
            
            const aboutInfo = document.getElementById('about-info')
            update = `
                <h3>About</h3>
                <p class="${type} about-text">${sepeciesDetails.aboutText}</p>
                <p class="about-species">Species: ${sepeciesDetails.species}</p>
                <div class="about-gender"><p>Gender rate: </p>${sepeciesDetails.genderRate}</div>
                <h3>species information</h3>
                <table class="about-tb">           

                </table>
            `
            aboutInfo.innerHTML += update
            
            const speciesInfo = document.querySelector('.about-tb')
            speciesInfo.innerHTML += aux

            updateHtml = `
            <tr>
                <td>Habitat</td>
                <td class="${type}">${sepeciesDetails.habitat}</td>
            </tr>
            <tr>
                <td>Egg Groups</td>
                <td class="${type}">${sepeciesDetails.eggGroup.map(group => `<p>${group}</p>`).join('')}</td>
            </tr>     
            `
            speciesInfo.innerHTML += updateHtml
            
            
            
        })
}