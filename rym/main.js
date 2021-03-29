// variables

const contenedor = document.getElementById('contenedor')

// funciones

const llamarAPI = async () => {
    const res = await fetch('https://rickandmortyapi.com/api/character/?page=1')
    const data = await res.json()
    const personajes = data.results

    const result = personajes
        .map((personaje) => generarTarjeta(personaje))
        .join(' ')
        

    contenedor.innerHTML = result
}

const generarTarjeta = ({ image, name, species }) => {
    return `
    <section>
        <img src="${image}" alt="${name}">
        <h3>${name} ${species}</h3>
    </section>
    `
}

// ejecuta la funcion en cuanto carga el archivo
llamarAPI()