async function generateUnsplashPhoto() {
    let url = "https://api.unsplash.com/photos?client_id=RQ1qbuvh4y4Drzw5FSFJCvVbtqYg3f4BzvSyPUnCSZk";
    const response = await fetch(url);
    if (response.ok) {
        data = await response.json();
        console.log(data);
        let imgUrlsAndAlt = data.map(data => [data.urls.regular , data.alt_description]);
        console.log(imgUrlsAndAlt);

        for (let i = 0; i < imgUrlsAndAlt.length; i++) {
            let div = document.createElement("div");
            div.className = "col-md-4 col-12 col-sm-6 image-container";
            div.innerHTML = `<img src="${imgUrlsAndAlt[i][0]}" class="img-fluid" alt="${imgUrlsAndAlt[i][1]}">`;
            document.getElementById("imagesContainer").appendChild(div);
        }
        createInfiniteScroll();
    }
    else {
        console.log(response.status);
    }
}

generateUnsplashPhoto();

function createInfiniteScroll(){
    let lastChildOfImagesContainer = document.querySelector("#imagesContainer").lastElementChild;
    const observer = new IntersectionObserver((entries) => {
        console.log(entries[0].target)
        console.log(entries[0].isIntersecting);
        if(entries[0].isIntersecting){
            entries[0].target.classList.add("intersecting");
            generateUnsplashPhoto();

        }else {
            entries[0].target.classList.remove("intersecting");
        };
    } , { threshold: 0.1 });
        observer.observe(lastChildOfImagesContainer);
}