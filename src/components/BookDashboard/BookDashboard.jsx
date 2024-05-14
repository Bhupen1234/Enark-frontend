import React, { Suspense, lazy, useEffect, useState } from "react";
import styles from "./BookDashboard.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useSnackbar } from "notistack";
const StickyHeadTable = lazy(() => import("../StickyHeadTable/StickyHeadTable"));
const BookDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const {enqueueSnackbar} = useSnackbar()

  const [addLoading,setAddLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const [debounceTimeOut, setDebounceTimeOut] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.trim() === "") {
      setFormData({ ...formData, [name]: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true)
      const response = await axios.post(`${API_BASE_URL}/books/`, formData);

      setBooks(response.data);
      setFormData({
        title: "",
        author: "",
        genre: "",
      });
      setAddLoading(false)
      enqueueSnackbar("Book added successfully",{variant:"success"})
    } catch (error) {
      enqueueSnackbar("Error while posting book",{variant:"error"})
    }
  };

  const getAllBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/books/`);

      setBooks(response.data);
    } catch (error) {
      enqueueSnackbar("Error in fetching the data",{variant:"error"})
    }
  };

  const searchBooks = async (searchKey) => {
    try {
      if (searchKey === "") {
        getAllBooks();
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/books/search?value=${searchKey}`
      );
      console.log(response.data);
      setBooks(response.data);
    } catch (error) {
      enqueueSnackbar(error.message,{variant:"error"})
    }
  };

  const debounceSearch = async (e, debounceTimeOut) => {
 
    setSearchTerm(e.target.value);

    if (debounceTimeOut) {
      clearTimeout(debounceTimeOut);
    }

    const timeout = setTimeout(() => {
      searchBooks(e.target.value);
    }, 500);

    setDebounceTimeOut(timeout);
  
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  return (
    <div className={styles.bookDashboard}>
      <div className={styles.formContainer}>
        <h1 style={{ textAlign: "center" }}>Book Collections</h1>
        <form onSubmit={async (e) => await handleSubmit(e)}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              minLength={3}
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="author">Author:</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="genre">Genre:</label>
            <input
              type="text"
              id="genre"
              name="genre"
              minLength={3}
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter book genre"
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>
           {addLoading ? "Adding...": "Add Book"}
          </button>
        </form>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={async(e) => await debounceSearch(e, debounceTimeOut)}
        placeholder="Search by title, author, or genre"
        className={styles.searchInput}
      />

      <Suspense fallback={<div>Loading...</div>}>
         <StickyHeadTable books={books} setBooks={setBooks}  />
      </Suspense>
      
    </div>
  );
};

export default BookDashboard;
