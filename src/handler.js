const { nanoid } = require('nanoid');
const books = require('./books');

const createBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    ).code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    ).code(400);
    return response;
  }

  const id = nanoid(16);

  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const addBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(addBook);
  const isSuccessFull = books.filter((bookObject) => bookObject.id === id).length > 0;

  if (isSuccessFull) {
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      },
    ).code(201);
    return response;
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    },
  ).code(500);
  return response;
};

const getAllBooksHandler = (req, h) => {
  const { name: dataNameBoks, reading, finished } = req.query;

  let dataBooks = books;

  if (dataNameBoks) {
    dataBooks = dataBooks.filter((bookObject) => bookObject.name.toLowerCase()
      .includes(dataNameBoks.toLowerCase()));
  } else if (reading) {
    dataBooks = dataBooks.filter((bookObject) => Number(bookObject.reading) === Number(reading));
  } else if (finished) {
    dataBooks = dataBooks.filter((bookObject) => Number(bookObject.finished) === Number(finished));
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditemukan',
    data: {
      books: dataBooks.map((
        {
          id,
          name,
          publisher,
        },
      ) => (
        { id, name, publisher }
      )),
    },
  }).code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const book = books.filter((bookObject) => bookObject.id === bookId)[0];

  if (book) {
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil ditemukan',
        data: {
          book,
        },
      },
    ).code(200);
    return response;
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku tidak ditemukan',
    },
  ).code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      },
    ).code(400);
    return response;
  }

  if (pageCount <= readPage) {
    const response = h.response(
      {
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      },
    ).code(400);
    return response;
  }

  const dataBooks = books.findIndex((bookObject) => bookObject.id === bookId);

  if (dataBooks !== -1) {
    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    books[dataBooks] = {
      ...books[dataBooks],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil diperbarui',
      },
    ).code(200);
    return response;
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    },
  ).code(404);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { bookId } = req.params;
  const dataBooks = books.findIndex((bookObject) => bookObject.id === bookId);

  if (dataBooks !== -1) {
    books.splice(dataBooks, 1);
    const response = h.response(
      {
        status: 'success',
        message: 'Buku berhasil dihapus',
      },
    ).code(200);
    return response;
  }

  const response = h.response(
    {
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    },
  ).code(404);
  return response;
};

module.exports = {
  createBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
