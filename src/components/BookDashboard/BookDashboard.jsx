import React, { useEffect, useState } from 'react'
import styles from "./BookDashboard.module.css"
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import StickyHeadTable from '../StickyHeadTable/StickyHeadTable';
const BookDashboard = () => {

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: ''
      });
      const [searchTerm, setSearchTerm] = useState('');

      const [filteredBooks ,setFilteredBooks] = useState([])
      const [books, setBooks] = useState([]);

  
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handleSubmit =async (e) => {

        
        e.preventDefault();
        try {
          
            const response = await axios.post(`${API_BASE_URL}/books/`, formData);
            const allBooksData = await axios.get(`${API_BASE_URL}/books`)
            setFilteredBooks(allBooksData.data);
            setFormData({
                title: '',
                author: '',
                genre: ''
            });
        } catch (error) {
            alert('Error posting data:', error);
        }
      };
      
     
      const getAllBooks = async ()=>{
        try {
            const response = await axios.get(`${API_BASE_URL}/books/`);
            console.log(response.data);
            setBooks(response.data);
            setFilteredBooks(response.data);
        } catch (error) {
            alert('Error getting data:', error);
        }
      }


      const handleSearchChange =(e)=>{
        const searchTerm = e.target.value.toLowerCase();
        console.log(books)
        if (searchTerm === '') {
          setFilteredBooks(books);
        } else {
          const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.genre.toLowerCase().includes(searchTerm)
          );
          setFilteredBooks(filteredBooks);
        }
      
        setSearchTerm(e.target.value);
      }


      useEffect(()=>{
          getAllBooks();
      },[])

      

   
  return (
    <div className={styles.bookDashboard}>
    <div className={styles.formContainer}>
        <h1 style={{textAlign:"center"}}>Book Collections</h1>
        <form onSubmit={async(e)=>await handleSubmit(e)}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
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
              value={formData.genre}
              onChange={handleChange}
              placeholder="Enter book genre"
              required
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.button}>Add Book</button>
        </form>
      </div>
      
      <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search by title, author, or genre"
                        className={styles.searchInput}
                    />
      <StickyHeadTable books={filteredBooks} setBooks={setBooks} getAllBooks={getAllBooks}/>
  </div>

  )
}

export default BookDashboard
