const books = [];
const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const BOOK_ITEMID = "itemId";
 
function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert("Browser kamu tidak mendukung local storage");
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

 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function makeBook(BookObject) {
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = BookObject.Title;

  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis : ' + BookObject.Author;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun : ' + BookObject.Year;

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');

  const trashButton = document.createElement('button');
  trashButton.classList.add('red');
  trashButton.innerText = 'Hapus';
  trashButton.setAttribute('id', 'button-delete');

  const textContainer = document.createElement('article');
  textContainer.classList.add('book_item');
  textContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);
  textContainer.setAttribute('id', `book-${BookObject.id}`);
 
  if (BookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('green');
    undoButton.setAttribute('id', 'button-undo');
    undoButton.innerText = 'Belum Selesai dibaca';
    
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });
 
    const trashButton = document.createElement('div');
    trashButton.classList.add("action");
 
    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(id);
    });
 
    textContainer.append(undoButton, trashButton);
  } else {
    const finishButton = document.createElement('button');
    finishButton.classList.add('green');
    finishButton.setAttribute('id', 'button-finish');
    finishButton.innerText = 'Selesai';
    buttonContainer.append(finishButton, trashButton);
    finishButton.addEventListener('click', function() {
        addTaskToComplated(booksObject.id);
    });

    trashButton.addEventListener('click', function() {
        removeTaskFromCompleted(BookObject.id);    
    });
}
    
  return textContainer;
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
