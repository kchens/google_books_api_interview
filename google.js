var LibraryBuilding = LibraryBuilding || {};

function Library() {
  this.collection = [];
}

Library.prototype = {
  addBooks: function(books) {
    var self = this;
    books.forEach(function(book) {
      self.collection.push(book);
    });
  },
  getTitles: function() {
    titles = [];
    this.collection.forEach(function(book) {
      titles.push(book.volumeInfo.title);
    });
    return titles;
  },
}

function Librarian(model, view) {
  this.library = model;
  this.view = view;
}
Librarian.prototype = {
  initialize: function() {
    this.bindEventListeners();
  },
  getAndParseBookSearch: function() {
    return this.view.searchField.val().replace(' ', '+').toLowerCase();
  },
  makeSearchAndStoreBooks: function(e) {
    e.preventDefault();

    var self = this;
    var baseUrl = 'https://www.googleapis.com/books/v1/volumes?q=';
    var searchText = self.getAndParseBookSearch();

    $.ajax({
      url: baseUrl + searchText,
      type: "GET",
      cache: false
    })
    .done( function(bookData) {
      self.library.addBooks(bookData.items);

      var titles = self.library.getTitles();

      self.view.renderBookDivs(titles);
    })
    .fail( function(e) {
      console.log("Failed search");
      console.log(e);
    });
  },
  bindEventListeners: function() {
    $(this.view.searchForm).on('submit', this.makeSearchAndStoreBooks.bind(this));
  },
}


function View() {
  this.searchForm =   $('form');
  this.searchField =  this.searchForm.find('input[name=book-search]');
  this.bookList =     $('#book-list');
}

View.prototype = {
  createBookDiv: function(bookTitle) {
    return $('<div/>').text(bookTitle)
  },
  renderBookDivs: function(bookTitles) {
    var self = this;
    bookTitles.forEach(function(title) {
      var titleDiv = self.createBookDiv(title);
      titleDiv.appendTo(self.bookList);
    });
  },
}

LibraryBuilding.myLibrary = new Library();
LibraryBuilding.myView = new View();
LibraryBuilding.myLibrarian = new Librarian(LibraryBuilding.myLibrary, LibraryBuilding.myView);

$(document).on('ready', function() {
  LibraryBuilding.myLibrarian.initialize();
});
