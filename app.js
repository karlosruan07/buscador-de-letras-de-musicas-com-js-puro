
const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const fetchData = async url =>{
    const response = await fetch(url)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    return await response.json()//tranforma os dados em json
}

const getMoreSongs = async url => {//para usar esse proxy do heroku, temos que permitir dessa URL.
    const data = await fetchData(`https://cors-anywhere.herokuapp.com/${url}`)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    insertSongsIntoPage(data)
}

const insertNextAndPrevButton = ({prev, next}) => {
    prevAndNextContainer.innerHTML = `
        ${prev ? `<button class="btn" onclick="getMoreSongs('${prev}')" >Anteriores</button>`: ''}
        ${next ? `<button class="btn" onclick="getMoreSongs('${next}')" >Próximas</button>`: ''}
        `
}

const insertSongsIntoPage = ({data, prev, next}) => {
    songsContainer.innerHTML = data.map(({artist:{ name }, title}) => //varre cada lista do array e executa a template string na em cada item (retorna outro array)
    `<li class="song">
        <span class="song-artist"><strong>${name}</strong> - ${title}</span>
    
        <button class="btn" data-artist="${name}" data-song-title="${title}">Ver letra</button>

    </li>
    `).join('')

    if(prev || next) {//songsInfo.prev e songsInfo.next são métodos da api
        
        insertNextAndPrevButton({prev, next})
        return
    }
    prevAndNextContainer.innerHTML = ""

}

const fetchSongs = async term => {
    const data = await fetchData(`${apiURL}/suggest/${term}`)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    insertSongsIntoPage(data)
}

form.addEventListener('submit', event => {
    event.preventDefault() //impede que envie a requisição
    const searchTerm = searchInput.value.trim()//remove os espaços em branco do inicio e do final
    searchInput.value = ''
    searchInput.focus()
    if(!searchTerm){//if a string for fazia (se for vazia searchTerm é falso)
        songsContainer.innerHTML = `<li class="warning-message">Por favor, Digite uma entrada válida !</li>`
        return
    }
    fetchSongs(searchTerm)
})

const insertlyricsIntoPage = ({lyrics, artist, songsTitle}) =>{
    songsContainer.innerHTML = `
    <li class="lyrics-container">
    <h2><strong>${songsTitle}</strong> - ${artist}</h2>
    <p class="lyrics">${lyrics}</p>
    </li>`
}


const fetchLyrics = async (artist, songsTitle) =>{
    const data = await fetchData(`${apiURL}/v1/${artist}/${songsTitle}`)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')
    insertlyricsIntoPage({lyrics, artist, songsTitle})
}

songsContainer.addEventListener('click', event => {
    const clickedElement = event.target
    if(clickedElement.tagName === 'BUTTON'){
        const artist = clickedElement.getAttribute('data-artist')
        const songsTitle = clickedElement.getAttribute('data-song-title')        
        prevAndNextContainer.innerHTML = ''
        fetchLyrics(artist, songsTitle)
    }
})

