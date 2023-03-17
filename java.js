const books = [];
const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelflist";
const COMPLETED_LIST_BOOK_ID = "completeBookshelflist";
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const BOOK_ITEMID = "itemId";
 
 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }
   
  function generateId() {
    return +new Date();
  }
 
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
 
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function makeBook(BookObject) {
  const {id, title, author, year, isCompleted} = BookObject;
 
  const BookTitle = document.createElement('h3');
  BookTitle.innerHTML = `Judul: <span>${title}</span>`;
 
  const BookAuthor = document.createElement('p');
  BookAuthor.innerHTML = `Penulis: <span>${author}</span>`;
 
  const BookYear = document.createElement('p');
  BookYear.innerHTML = `Tahun: <span>${year}</span>`;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(BookTitle, BookAuthor, BookYear);
 
  const container = document.createElement('div');
  container.classList.add('book_list', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `book-${BookObject.id}`);
 
  if (isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
 
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    
    checkButton.addEventListener('click', function () {
      addBookToCompleted(id);
    });
 
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
 
    trashButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });
    
    container.append(checkButton, trashButton);
  }
 
  return container;
}
  
function addBook() {
    const incompletedBookList = document.getElementById(INCOMPLETED_LIST_BOOK_ID);
    const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
   
    const BookTitle = document.getElementById('inputBookTitle').value;
    const BookAuthor = document.getElementById('inputBookAuthor').value;
    const BookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
   
    const generatedID = generateId();
    const BookObject = generateBookObject(generatedID, BookTitle, BookAuthor, BookYear, isComplete);
      books.push(BookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
document.addEventListener(RENDER_EVENT, function () {
  const incompletedBOOKList = document.getElementById('books');
  incompleteBookshelfList.innerHTML = '';
 
const completedBOOKList = document.getElementById('completed-books');
  completeBookshelfList.innerHTML = '';  
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) 
    incompleteBookshelfList.append(bookElement);
    else
        completeBookshelfList.append(bookElement);
 
  }
});
 
function addBookToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
 
 
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}
 
incompleteBookshelfList.innerHTML = '';
completeBookshelfList.innerHTML = '';
 
for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
 
 
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
 
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
 
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
 
document.addEventListener("ondatasaved", () => {
    console.log("Data berhasil disimpan.");
});
