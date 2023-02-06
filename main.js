let books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "Bookshelf_dicoding";

document.addEventListener("DOMContentLoaded", function() {
 
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
      event.preventDefault();
      addBook();
  });

  if(isStorageExist()){
    loadDataFromStorage();
}
});

function generateId() {
return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
return {
    id,
    title,
    author,
    year,
    isCompleted
}
}

 addBook = () => {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;
  const Bookcomplete = document.getElementById("inputBookIsComplete").checked;
  

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, Bookcomplete);
  books.push(bookObject);

  
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
const incompletedBookList = document.getElementById("incompleteBookshelfList");
incompletedBookList.innerHTML = "";

const completedBookList = document.getElementById("completeBookshelfList");
completedBookList.innerHTML = "";
for(bookItem of books){
    const bookElement = makeBook(bookItem);
 
    if(bookItem.isCompleted == false)
        incompletedBookList.append(bookElement);
    else
        completedBookList.append(bookElement);
}

});

const checkbox = document.getElementById("inputBookIsComplete");
const spanobject = document.getElementById("submitbuttonspan");
checkbox.addEventListener("change", function () {
if (checkbox.checked == true){
 spanobject.textContent = "Selesai dibaca"
}
else {
 spanobject.textContent = "Belum selesai dibaca"
}
})


makeBook = (inCompleteBook) => {

const textTitle = document.createElement("h2");
textTitle.innerText = inCompleteBook.title;

const textAuthor = document.createElement("p");
textAuthor.innerText = inCompleteBook.author;

const textYear = document.createElement("p");
textYear.innerText = inCompleteBook.year;

const buttonAction = document.createElement("div");
buttonAction.classList.add("action")

const container = document.createElement("article");
container.classList.add("book_item")
container.append(textTitle,textAuthor,textYear,buttonAction);
container.setAttribute("id", `bookID-${inCompleteBook.id}`);

if(inCompleteBook.isCompleted){

    const unreadButton = document.createElement("button");
    unreadButton.classList.add("blue");
    unreadButton.innerText = "Belum selesai di Baca";
    unreadButton.addEventListener("click", function () {
        bookIncomplete(inCompleteBook.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function () {
        confirmAction(inCompleteBook.id);
    });

    buttonAction.append(unreadButton, trashButton);
    } 

    else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai dibaca";
    checkButton.addEventListener("click", function () {
        addBookToComplete(inCompleteBook.id);
    })
    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";
    trashButton.addEventListener("click", function () {
        confirmAction(inCompleteBook.id);
    });;

    buttonAction.append(checkButton, trashButton);
}

return container;
}

confirmAction = (bookElement) => {
const bookTarget = findBook(bookElement);
let confirmAction = confirm(`are you sure to delete book with title " ${bookTarget.title} " ?`);
if (confirmAction) {
removeBookFromIncomplete(bookElement);
removeBookFromComplete(bookElement);
alert(`book with title " ${bookTarget.title} " successfully deleted`);
} else {
alert("delete action canceled");
}
}

findBook = (bookId) => {
for(bookItem of books){
  if(bookItem.id === bookId){
      return bookItem
  }
}
return null
}

findBookIndex = (bookId) => {
for(index in books){
    if(books[index].id === bookId){
        return index
    }
}
return -1
}

addBookToComplete = (bookId) => {

const bookTarget = findBook(bookId);
if(bookTarget == null) return;

bookTarget.isCompleted = true;
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

removeBookFromComplete = (bookId) => {
const bookTarget = findBookIndex(bookId);
if(bookTarget === -1) return;
books.splice(bookTarget, 1);

document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

removeBookFromIncomplete = (bookId) => {
const bookTarget = findBookIndex(bookId);
if(bookTarget === -1) return;
books.splice(bookTarget, 1);

document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

bookIncomplete = (bookId) => {
const bookTarget = findBook(bookId);
if(bookTarget == null) return;


bookTarget.isCompleted = false;
document.dispatchEvent(new Event(RENDER_EVENT));
saveData();
}

function saveData() {
if(isStorageExist()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
}
}

function isStorageExist() /* boolean */ {
if(typeof(Storage) === undefined){
  alert("Browser kamu tidak mendukung local storage");
  return false
}
return true;
}

function loadDataFromStorage() {
const serializedData = localStorage.getItem(STORAGE_KEY);

let data = JSON.parse(serializedData);

if(data !== null){
  for(book of data){
      books.push(book);
  }
}


document.dispatchEvent(new Event(RENDER_EVENT));
}