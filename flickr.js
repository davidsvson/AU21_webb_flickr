let currentPage = 1;
let loadingImages = false;

document.querySelector('#search-button').addEventListener('click', async () => {
    //rensa gamla bilder
    document.querySelector('main').innerHTML = "";

    //hämta bilder
    let imageData = await getImages();

   // console.log('images: ', imageData);
    //visa upp bilder
    updateUI(imageData);
})

document.querySelector('#overlay').addEventListener('click', () => {
    document.querySelector('#overlay').classList.toggle('show');
})


async function getImages() {
    //URL: https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=647cf2983b195b8200be7d71e85b4b21&text=flower&format=json&nojsoncallback=1

    const baseUrl = 'https://www.flickr.com/services/rest/';
    const apiKey = '076b2338e575240ec735cee082c0b5b5';
    const text = document.querySelector('#text').value;
    const method = 'flickr.photos.search';

    const url = `${baseUrl}?method=${method}&api_key=${apiKey}&page=${currentPage}&text=${text}&format=json&nojsoncallback=1`;

    const resp = await fetch(url)
    const data = await resp.json();


    return data;
}

function updateUI(data) {
    const main = document.querySelector('main');

    data.photos.photo.forEach(img => {
        const el = document.createElement('img');
        el.setAttribute('src', imgUrl(img, 'thumb') );
        el.setAttribute('alt', img.title);

        el.addEventListener('click', () => {
            openLightBox(img.title, imgUrl(img, 'large'));
        })
        main.appendChild(el);
    });
}
 

function openLightBox(title, url) {
    let el = document.querySelector('#overlay img');
    el.setAttribute('src', url );
    el.setAttribute('alt', title);

    document.querySelector('#overlay figcaption').innerHTML = title;
    document.querySelector('#overlay').classList.toggle('show');

}

function imgUrl(img, size) {
    let sizeSuffix = 'z';
    if(size == 'thumb') { sizeSuffix = 'q' };
    if(size == 'large') { sizeSuffix = 'b' };

    const url = `https://live.staticflickr.com/${img.server}/${img.id}_${img.secret}_${sizeSuffix}.jpg`;
 
    return url;
}

window.onscroll = function() {
    const doc = document.documentElement;

    const offset = doc.scrollTop + window.outerHeight;
    const height = doc.offsetHeight;

    if(offset >= height) {
        //console.log("at bottom");

        if(!loadingImages) {
            nextPage();
        }
    }
}

async function nextPage() {
    loadingImages = true;

    currentPage++;
    const imageData = await getImages();
    
    updateUI(imageData);

    loadingImages = false;
}




