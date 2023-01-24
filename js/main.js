const insertPokemonLi = document.getElementById('pokemon-list')
const paginationBtn = document.getElementById('pagination-btn')
const paginationBtnParent = document.querySelector('.pagination')
const gen = document.querySelector('#generation')
const filterBtn = document.querySelector('#filter-btn')

const limit = 20
let offset = 0

const generation = [0,151,251,386,493,649,721,809,890] //8 gerações
var pokemonLimiter = generation[8]
const regions = ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "galar"]
const pokemonTypes = ["bug", "dragon", "fairy", "fire", "ghost", "ground", "normal", "psychic", "steel", "dark", "electric", "fighting", "flying", "grass", "ice", "poison", "rock", "water", "all-types"]




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

function loadMorePokemon(offset,limit, reload = 0, type ='all-types'){     //função para carregar mais pokemon
    api.getPokemonList(offset,limit).then( (pokemonList = []) => {
        updateList = pokemonList.map( pokemon => {
            if(type === 'all-types'){
                return pokemonListToLi(pokemon)
            }else{
                if(type === pokemon.type){
                    return pokemonListToLi(pokemon)
                }
            }
            

        }).join('')

        if(reload == 0){
            insertPokemonLi.innerHTML += updateList
        }else{
            insertPokemonLi.innerHTML = updateList
        }
        
    })
}


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


/* Advanced search */

const FilterToggle = () => {
    document.querySelector('#filter-show').classList.toggle('toggle-filter');

    document.querySelector('#filter-show').innerHTML = `
    <div class="filter-options">
        <div class="filter-regions">
            <h3>Regions</h3>
            <ul class="filter-radio-list">
                ${regions.map((region, value=0) => `
                <li>
                    <input type="radio" name="region" class="radio-options region-options" id="region-${region}" value="${value++}" >
                    <label for="region-${region}" class="radio-labels">${region}</label>
                </li>
                `).join('')}
            </ul>
        </div>
        <div class="filter-types">
            <h3>Types</h3>
            <ul class="filter-radio-list">
                ${pokemonTypes.map( (type) => `
                <li>
                    <input type="radio" name="type" class="radio-options type-options" id="type-${type}" value="${type}" >
                    <label for="type-${type}" class="${type} radio-labels">${type}</label>
                </li>
                `).join('')}
            </ul>
        </div>
    </div>
    <div class="filter-submit">
        <button id="reset-btn" onclick="resetFilters()">Reset</button>
        <button type="submit" id="filter-btn" onclick="applyFilters()">Search</button>
    </div>
    `
    document.querySelector("#type-all-types").checked = true
    document.querySelector("#region-kanto").checked = true
}

applyFilters = () => {
    
    const radiosRegion = document.getElementsByClassName("region-options");
    const radiosTypes = document.getElementsByClassName("type-options")
    var typeChosen = 'all-types'
    var regionChosen = 0

    for (var i = 0; i < radiosTypes.length; i++) {
        if (radiosTypes[i].checked) {
            typeChosen = radiosTypes[i].value
        }
    }

    for (var i = 0; i < radiosRegion.length; i++) {
        if (radiosRegion[i].checked) {
            regionChosen = parseInt(radiosRegion[i].value)
            console.log(regionChosen)
            offset = generation[regionChosen]
            console.log(offset)
            pokemonLimiter = generation[regionChosen+1]-offset
            console.log(pokemonLimiter)
            loadMorePokemon(offset,pokemonLimiter,1,typeChosen)
        
        }

    } 

    document.querySelector('#filter-show').classList.toggle('toggle-filter'); 
}

resetFilters = ()=> {
    document.querySelector('#filter-show').classList.toggle('toggle-filter');
    offset = 0
    loadMorePokemon(offset,limit,1)
    paginationBtnParent.appendChild(paginationBtn)
}


/* Search bar */
const searchBar = document.getElementById("search-bar")

searchBar.addEventListener('keypress', (e) => {
    let userData = e.target.value

    if (e.key === "Enter") {
        if(userData){
            e.preventDefault();
            showDetails(userData.trim().toLowerCase()); 
        }
    }
});

const searchButton = () => {
    let userData = searchBar.value

    if(userData){
        showDetails(userData.trim().toLowerCase()); 
    }
}

const searchHelper = api.searchBar()
loadMorePokemon(offset,limit)
