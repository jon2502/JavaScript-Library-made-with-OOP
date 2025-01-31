var library = document.getElementById('library_Container')
var Statemanger = document.getElementById('Statemanger')

//states
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

    Validatestate(){
        //get only books of the selected state
        if(Available === true && this.isAvailable === true){
            return true
        } else if(Borrowed === true && this.isAvailable === false){
            return true
        }
    }

    generateBook(){
        const section = document.createElement('section'); // Create a new div element
        section.classList.add('box')
        //add child content to it
        section.innerHTML = `
            <div class="row mb-2">
                <div class="col-sm-1">
                    <img class="img-fluid" src = "${this.cover_image}">
                </div>
                <div class="col">
                    <h5>${this.title}</h5>
                    <p>By ${this.author}</p>
                </div>
                ${this.series ?`<p class="col">part of the ${this.series} series</p>`:`<div class="col"></div>`}
                <p class="col">ISBN: ${this.isbn}</p>
                <p class="col">First published: ${this.published_year}</p>
                <div class="col">
                    <button class="BTN col" data-isbn="${this.isbn}">
                        ${Available === true ?`borrow book`:`retun book`}
                    </button>
                </div>
            </div>
            <div>
                <p>${this.synopsis}</p>
            </div>
`;
        //then return it
        return section;
    }
}

async function getData() {
    const response = await fetch('Book.json');
    var BookList = await response.json();
    Checkstate(BookList)
}
getData()

async function Checkstate(BookList) {
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
                Checkstate(BookList)
            })
            createLibrary(BookList)
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
                Checkstate(BookList)
            })
            createLibrary(BookList)
        break;
        default:
            Statemanger.innerHTML =`
            <h3>An error has ocured</h3>
            <p>there was an error regading the values. please try again or check the code on line 5 to 6 and 67 to 102.</p>
            `
    }
}

async function createLibrary(BookList) {
    library.innerHTML=``
    for(var Book of BookList){
        var NewBook = new Books(Book.title, Book.author, Book.series, Book.cover_image, Book.synopsis, Book.genres, Book.isbn, Book.published_year, Book.isAvailable)
        if (NewBook.Validatestate() === true){
            library.appendChild(NewBook.generateBook())
        }
    }
    var BTNAction = document.querySelectorAll(".BTN")
    BTNAction.forEach(BTN => {
        BTN.addEventListener("click", function(){
            const isbn = BTN.getAttribute("data-isbn"); 
            const bookToUpdate = BookList.find(Book => Book.isbn === isbn)
            if (bookToUpdate) {
                bookToUpdate.isAvailable = !bookToUpdate.isAvailable; // Toggle availability
                Checkstate(BookList); // Re-render the library
            } else{
                //error mesage
                const ErrorMesage = document.createElement('p')
                ErrorMesage.innerHTML=`there was an error regading the ISBN number.<br>
                try againg or try to reload the page.
                `
                Statemanger.appendChild(ErrorMesage)
            }
        })
    });
}
