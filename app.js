document.addEventListener('DOMContentLoaded', () => {
    let container = document.getElementById('album-container');
    let list = document.querySelectorAll('album')

    function pageScroll() {
        container.scrollBy(1, 0);
        scrolldelay = setTimeout(pageScroll,13);

    }

    pageScroll();

   

   
    

    });
