var library = document.getElementById('library_Container')
var Statemanger = document.getElementById('Statemanger')

var Available = true
var Borrowed = false

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

    Checkbookstate(){

    }

    generateBook(){
        const div = document.createElement('div'); // Create a new div element
        //add child content to it
        div.classList.add('row', 'mb-2')
        div.innerHTML = `
            <div class="col-sm-1">
                <img class="img-fluid" src = "${this.cover_image}">
            </div>
            <div class="col">
                <h5>${this.title}</h5>
                <p>By ${this.author}</p>
            </div>
             ${this.series ?`
                <div class="col">
                    <p>part of the ${this.series} series</p>
                </div>
            `:``}
            <p class="col">ISBN: ${this.isbn}</p>
            <p class="col">${this.published_year}</p>
        `;
        //then return it
        return div;
    }
}

async function Checkstate(Available, Borrowed) {
    Statemanger.innerHTML=``
    switch(true){
        case Available === true:
            Statemanger.innerHTML=`
            <h1>Avalible books</h1>
            <button id="changeStat">check borrowed books</button>
            `
            var changeEvent = document.getElementById('changeStat')
            changeEvent.addEventListener('click',function(){
                Available = false
                Borrowed = true
                Checkstate(Available, Borrowed)
            })
            createLibrary()
        break;
        case Borrowed === true:
            Statemanger.innerHTML=`
            <h1>Borrowed books</h1>
            <button id="changeStat">check avalible books</button>
            `
            var changeEvent = document.getElementById('changeStat')
            changeEvent.addEventListener('click',function(){
                Available = true
                Borrowed = false
                Checkstate(Available, Borrowed)
                
            })
            
        break;
        default:
            Statemanger.innerHTML =`
            <h3>An error has ocured</h3>
            <p> there was an error regading the values. please try again or check the code on line 5 to 6 and.</p>
            `
    }
}
Checkstate(Available, Borrowed)

async function createLibrary() {
    const response = await fetch('Book.json');
    var BookList = await response.json();
    console.log(BookList)
    for(var Book of BookList){
        var NewBook = new Books(Book.title, Book.author, Book.series, Book.cover_image, Book.synopsis, Book.genres, Book.isbn, Book.published_year, Book.isAvailable)
        library.appendChild(NewBook.generateBook())
    }
}
