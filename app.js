document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById('album-container');
    let list = document.querySelectorAll('album');

    container.addEventListener("mouseover", () => {
        
    });
    

    function pageScroll() {
        container.scrollBy(1, 0);
        setTimeout(pageScroll, 18);
    }
    

    function createAlbums() {
        for (let i = 0; i < 402; i++) {
            const newAlbum = document.createElement("img");
        newAlbum.setAttribute("class", "album");
        container.appendChild(newAlbum);
        }
    }

    createAlbums();
    pageScroll();

    });
