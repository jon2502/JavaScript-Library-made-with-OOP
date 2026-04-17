var library = document.getElementById('library_Container')
var Statemanger = document.getElementById('Statemanger')

//states
var Available = true
var Borrowed = false

//setup class
class Books {
    constructor(title, author, series, cover_image, synopsis, genres, isbn, published_year, total_amount, amount_borrowed) {
        this.title = title;
        this.author = author;
        this.series = series;
        this.cover_image = cover_image;
        this.synopsis = synopsis;
        this.genres = genres;
        this.isbn = isbn;
        this.published_year = published_year;
        this.total_amount = total_amount
        this.amount_borrowed = amount_borrowed 
    }

    Validatestate(){
        //get only books of the selected state
        if(Available === true && this.total_amount > this.amount_borrowed){
            return true
        } else if(Borrowed === true && this.amount_borrowed > 0){
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
                <div class="col">
                    <p>ISBN: ${this.isbn}</p>
                    <p>First published: ${this.published_year}</p>
                </div>
                <div class="col">
                    <p class="genre"><b>Genres</b></p>
                    ${this.genres.map((genre)=>`<p class="genre">${genre}</p>`).join('')}
                </div>
                <div class="col">
                    <p class="genre"><b>Amount avliable</b></p>
                    <p>${this.total_amount === this.amount_borrowed?`Not avaliable`:`${this.total_amount-this.amount_borrowed}`}</p>
                </div>
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
        var NewBook = new Books(Book.title, Book.author, Book.series, Book.cover_image, Book.synopsis, Book.genres, Book.isbn, Book.published_year, Book.total_amount, Book.amount_borrowed)
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
                // Borrow or return books
                    switch(true){
                    case Available === true:
                        bookToUpdate.amount_borrowed =  bookToUpdate.amount_borrowed + 1
                        if(bookToUpdate.amount_borrowed>bookToUpdate.total_amount){
                            bookToUpdate.amount_borrowed = bookToUpdate.total_amount
                        }
                        Checkstate(BookList); // Re-render the library*/
                    break;
                    case Borrowed === true:
                        bookToUpdate.amount_borrowed =  bookToUpdate.amount_borrowed - 1
                        if(bookToUpdate.amount_borrowed<0){
                            bookToUpdate.amount_borrowed = 0
                        }
                        Checkstate(BookList);
                    break;
                    default:
                        const ErrorMesage = document.createElement('p')
                        ErrorMesage.innerHTML=`there was an error regading borrowing or returning book.<br>
                        try againg or try to reload the page.`
                        Statemanger.appendChild(ErrorMesage)
                }
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
