var library = document.getElementById('library_Container')

var User = "UserName"

//setup class
class Books {
    constructor(title, author, series, cover_image, synopsis, genres, isbn, published_year, isAvailable) {
        this.title = title;
        this.author = author;
        this.series = series;
        this.cover_image = cover_image;
        this.synopsis = synopsis;
        this.genres = genres;
        this.isbn = isbn;
        this.published_year = published_year;
        this.isAvailable = isAvailable;
    }

    generateBook(){
        const div = document.createElement('div'); // Create a new div element
        //add child content to it
        div.classList.add('row')
        div.innerHTML = `
            <div class="col-sm-1">
                <img class="img-fluid" src = "${this.cover_image}">
            </div>
            <div class="col">
                <h5>${this.title}</h5>
                <p>By ${this.author}</p>
            </div>
            <p class="col">${this.series}</p>
            <p class="col">ISBN: ${this.isbn}</p>
            <p class="col">${this.published_year}</p>
        `;
        //then return it
        return div;
    }
}


async function createLibrary() {
    const response = await fetch('Book.json');
    var BookList = await response.json();
    console.log(BookList)
    for(var Book of BookList){
        var NewBook = new Books(Book.title, Book.author, Book.series, Book.cover_image, Book.synopsis, Book.genres, Book.isbn, Book.published_year, Book.isAvailable)
        library.appendChild(NewBook.generateBook())
    }
}
createLibrary()