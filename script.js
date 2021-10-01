'use strict';

const welcome = document.querySelector('.welcome');
const yourLibrary = document.querySelector('.your__library');
const cards = document.querySelector('.cards');
const quote = document.querySelector('.quote');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const form = document.querySelector('form');

const btnCloseModal = document.querySelector('.close__modal');
const btnOpenModal = document.querySelector('.btn__open--modal');
const btnNewBook = document.querySelector('.btn__new--book');

const inputBookTitle = document.querySelector('.input__book--title');
const inputBookAuthor = document.querySelector('.input__book--author');
const inputBookPages = document.querySelector('.input__book--pages');
const inputBookStatus = document.querySelector('.input__book--status');

let myLibrary;

class Book {
  constructor(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
  }
}

// Get books from local storage
if (localStorage.getItem('books') === null) myLibrary = [];
else {
  const booksFromStorage = JSON.parse(localStorage.getItem('books'));
  myLibrary = booksFromStorage;
}

// Add book to library

const addBookToLibrary = function (title, author, pages, status) {
  const newBook = new Book(title, author, pages, status);
  myLibrary.push(newBook);
  displayBooks();
};

// Change status

const formChangeInputBookStatus = function (e) {
  e.preventDefault();
  if (e.target.value === 'Not Read') {
    inputBookStatus.style.color = '#00f5d4';
    inputBookStatus.value = 'Read';
  } else if (e.target.value === 'Read') {
    inputBookStatus.style.color = '#f15bb5';
    inputBookStatus.value = 'Not Read';
  }
};

// Add New Book

const addNewBook = function (e) {
  e.preventDefault();

  const title = inputBookTitle.value;
  const author = inputBookAuthor.value;
  const pages = inputBookPages.value;
  const status = inputBookStatus.value;

  if (title === '' || author === '' || pages === '') {
    alert('Please, fill the empty field!');
    return;
  }

  addBookToLibrary(title, author, pages, status);
  closeModal();
};

// Delete Book

const selectBook = function (e) {
  e.preventDefault();
  const currentTargetBook =
    e.target.parentNode.parentNode.childNodes[3].childNodes[3].innerHTML;
  if (e.target.classList.value === 'btn__delete') {
    deleteBook(findBook(myLibrary, currentTargetBook));
  }
  if (e.target.classList.contains('input__book--status')) {
    changeStatus(findBook(myLibrary, currentTargetBook));
  }
  displayBooks();
};

// Change Status
const changeStatus = function (book) {
  if (myLibrary[book].status === 'Read') {
    myLibrary[book].status = 'Not Read';
  } else {
    myLibrary[book].status = 'Read';
  }
};

const deleteBook = function (currentTargetBook) {
  myLibrary.splice(currentTargetBook, currentTargetBook + 1);
};

const findBook = function (myLibraryArray, title) {
  if (myLibraryArray.length === 0 || myLibraryArray === null) {
    return;
  }
  for (let i = 0; i < myLibraryArray.length; i++) {
    if (myLibraryArray[i].title === title) {
      const index = myLibraryArray.indexOf(myLibraryArray[i]);
      return index;
    }
  }
};

// Display Books

const displayBooks = function () {
  localStorage.setItem('books', JSON.stringify(myLibrary));
  cards.innerHTML = '';
  myLibrary.forEach(function (book) {
    // Add new card
    const html = `
    <div class="card">
      <div class="delete">
        <button class="btn__delete">&times</button>
      </div>
      <div class="card__title">
        <h2 class="title">Title:</h2>
        <h2 class="book__title">${book.title}</h2>
      </div>
      <h3 class="author">
          Author: <span class="author__name">${book.author}</span>
      </h3>
      <h3>Pages: <span class="num__pages">${book.pages}</span></h3>
      <div class="btn__read">
      <button class="input__book--status btn">${book.status}</button>
      </div>
    </div>
    `;

    cards.insertAdjacentHTML('afterbegin', html);
  });

  updateUI();
};

// Display quote or cards
const updateUI = function () {
  if (myLibrary.length > 0) quote.classList.add('hidden');
  if (myLibrary.length > 0) cards.classList.remove('hidden');
  if (myLibrary.length > 0) welcome.classList.add('hidden');
  if (myLibrary.length > 0) yourLibrary.classList.remove('hidden');
};

// Open and Close Modal Window

const openModal = function () {
  form.reset();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

cards.addEventListener('click', selectBook);
btnOpenModal.addEventListener('click', openModal);
inputBookStatus.addEventListener('click', formChangeInputBookStatus);
btnNewBook.addEventListener('click', addNewBook);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

displayBooks();
