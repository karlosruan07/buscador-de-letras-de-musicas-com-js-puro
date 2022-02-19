
const form = document.querySelector('#form')
const searchInput = document.querySelector('#search')
const songsContainer = document.querySelector('#songs-container')
const prevAndNextContainer = document.querySelector('#prev-and-next-container')

const apiURL = `https://api.lyrics.ovh`

const getMoreSongs = async url => {//para usar esse proxy do heroku, temos que permitir dessa URL.
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    const data = await response.json()//tranforma os dados em json

    insertSongsIntoPage(data)
}

const insertSongsIntoPage = songsInfo => {
    
    //debugger

    console.log(songsInfo)

    songsContainer.innerHTML = songsInfo.data.map(songs => //varre cada lista do array e executa a template string na em cada item (retorna outro array)
    
    //console.log(songs.artist.name, songs.title)

    `<li class="song">
        <span class="song-artist"><strong>${songs.artist.name}</strong> - ${songs.title}</span>
    
        <button class="btn" data-artist="${songs.artist.name}" data-song-title="${songs.title}">Ver letra</button>

    </li>
    `).join('')

    if(songsInfo.prev || songsInfo.next) {
        prevAndNextContainer.innerHTML = `
        ${songsInfo.prev ? `<button class="btn" onclick="getMoreSongs('${songsInfo.prev}')" >Anteriores</button>`: ''}
        ${songsInfo.next ? `<button class="btn" onclick="getMoreSongs('${songsInfo.next}')" >Próximas</button>`: ''}
        `
        return
    }
    prevAndNextContainer.innerHTML = ""

}

const fetchSongs = async term => {
    const response = await fetch(`${apiURL}/suggest/${term}`)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    const data = await response.json()//tranforma os dados em json

    insertSongsIntoPage(data)
}


form.addEventListener('submit', event => {
    event.preventDefault() //impede que envie a requisição
    //alert('foi enviado')
    const searchTerm = searchInput.value.trim()//remove os espaços em branco do inicio e do final

    if(!searchTerm){//if a string for fazia (se for vazia searchTerm é falso)
        songsContainer.innerHTML = `<li class="warning-message">Por favor, Digite uma entrada válida !</li>`
        return
    }

    fetchSongs(searchTerm)

})


const fetchLyrics = async (artist, songsTitle) =>{
    const response = await fetch(`${apiURL}/v1/${artist}/${songsTitle}`)//await espera a requisição do fetch ser concluida, e nenhum código da linha pra baixo é executada;
    const data = await response.json()//tranforma os dados em json

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    songsContainer.innerHTML = `
    <li class="lyrics-container">
    <h2><strong>${songsTitle}</strong> - ${artist}</h2>
    <p class="lyrics">${lyrics}</p>
    </li>
    `
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

