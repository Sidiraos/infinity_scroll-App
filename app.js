let page = 1;
const info = document.getElementById("info");

async function generateUnsplashPhoto(page) {
    let url = `https://api.unsplash.com/photos?client_id=RQ1qbuvh4y4Drzw5FSFJCvVbtqYg3f4BzvSyPUnCSZk;page=${page}`;
    
        const response = await fetch(url);
        if (response.ok) {
            data = await response.json();
            console.log(data);
            let imgUrlsAndAlt = data.map(data => [data.urls.regular , data.alt_description]);
            console.log(imgUrlsAndAlt);
    
            addImagesInDOM(imgUrlsAndAlt , "#imagesContainer" );
            createInfiniteScroll(generateUnsplashPhoto , "#imagesContainer" , query = undefined);
        } else {
            console.log(response.status);
        }
    
}

generateUnsplashPhoto(page);

function addImagesInDOM(imgUrlsAndAlt , idContainer){
    for (let i = 0; i < imgUrlsAndAlt.length; i++) {
        let div = document.createElement("div");
        div.className = "col-md-4 col-12 col-sm-6 image-container";
        div.innerHTML = `<img src="${imgUrlsAndAlt[i][0]}" class="img-fluid" alt="${imgUrlsAndAlt[i][1]}">`;
        document.querySelector(`${idContainer}`).appendChild(div);
    }
}

function createInfiniteScroll(callApiFetch , idContainer , query){
    let lastChildOfImagesContainer = document.querySelector(`${idContainer}`).lastElementChild;
    const observer = new IntersectionObserver((entries) => {
        console.log(entries[0].target)
        console.log(entries[0].isIntersecting);
        if(entries[0].isIntersecting){
            entries[0].target.classList.add("intersecting");
            page++;
            callApiFetch(page , query);
            observer.unobserve(lastChildOfImagesContainer);

        }else {
            entries[0].target.classList.remove("intersecting");
        };
    } , { threshold: 0.1 });
        observer.observe(lastChildOfImagesContainer);
}


async function searchPhotos(page, query){
        let searchUrl = `https://api.unsplash.com/search/photos?client_id=RQ1qbuvh4y4Drzw5FSFJCvVbtqYg3f4BzvSyPUnCSZk;page=${page}&query=${query}`;
        try {
            const results = await fetch(searchUrl);
            if(results.ok){
                let data = await results.json();
                console.log(data);
                let imgUrlsAndAlt = data.results.map(data => [data.urls.regular , data.alt_description]);
                console.log(imgUrlsAndAlt);
                addImagesInDOM(imgUrlsAndAlt , "#searchResultImages" );
                createInfiniteScroll(searchPhotos , "#searchResultImages" , query);
            } else {
                console.log(results.status);
                if(results.status == 403) {
                    showInfo("Rate Limit Exceeded " + results.status);
                    document.querySelector("#imagesContainer").classList.remove("d-none");
                    throw new Error("Rate Limit Exceeded : " + results.status)
                }
            }
        } catch (error) {
            console.error("l'url search failed", error);
        }
    

}

const form = document.getElementById("searchForm");
form.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(e) {
    page = 1;
    document.querySelector("#searchResultImages").textContent = "";
    e.preventDefault();
    let query = document.getElementById("searchInput").value;
    if(! query) {
        showInfo("Please enter a search term");
    } else {
        info.textContent = "";
        info.classList.add("d-none");
        searchPhotos(page, query);
        document.querySelector("#imagesContainer").classList.add("d-none");
        document.querySelector("#searchResultImages").classList.remove("d-none");
    }

}

function showInfo(text){
    info.classList.remove("d-none");
        info.textContent = text;
        setTimeout(() => {
            info.classList.add("d-none");
        }, 3000) ;

}

let lock = false;
function handleScrollUp(e){
    if (lock) return;
    lock = true;
    window.scrollTo(0, 0);
    setTimeout(() => {
        lock = false;
    }, 5000)
}
const btnScrollUp = document.querySelector(".fixed-icon");

btnScrollUp.addEventListener("click", handleScrollUp);

document.querySelector("#reloadPage").addEventListener("click", () => {
    window.location.reload();
});