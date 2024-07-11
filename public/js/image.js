document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('generate-btn');
    const catImage = document.getElementById('cat-image');

    loadImageFromStorage(catImage);
    button.addEventListener('click', (event) => handleButtonClick(event, catImage));
});

function loadImageFromStorage(catImage) {
    const storedImageUrl = localStorage.getItem('catImageUrl');
    if (storedImageUrl) {
        setCatImage(catImage, storedImageUrl);
    }
}

function handleButtonClick(event, catImage) {
    event.preventDefault();
    fetchCatImage()
        .then(imageUrl => {
            localStorage.setItem('catImageUrl', imageUrl);
            setCatImage(catImage, imageUrl);
            return updateProcess();
        })
        .then(data => console.log(data))
        .catch(error => console.error('Erro ao buscar a imagem:', error));
}

function fetchCatImage() {
    return fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => response.json())
        .then(data => data[0].url);
}

function setCatImage(catImage, imageUrl) {
    catImage.src = imageUrl;
    catImage.style.display = 'block';
}

function updateProcess() {
    const processName = "image";
    return fetch(`http://localhost:4000/process/${processName}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json());
}