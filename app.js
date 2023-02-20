let url = "https://api.unsplash.com/photos?client_id=RQ1qbuvh4y4Drzw5FSFJCvVbtqYg3f4BzvSyPUnCSZk";
async function generateUnsplashPhoto(url) {
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
        
    }
    else {
        console.log(response.status);
    }
}

generateUnsplashPhoto(url);