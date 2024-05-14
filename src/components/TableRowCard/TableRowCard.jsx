import React, { useState } from 'react'
import TableRow from "@mui/material/TableRow";
import { Button, Dialog, TableCell } from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import styles from "./TableRowCard.module.css"
import DeleteIcon from '@mui/icons-material/Delete';
import { useSnackbar } from 'notistack';

const TableRowCard = ({row,books,setBooks}) => {
  const [open, setOpen] = useState(false);
  const [updateformData, setUpdateFormData] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const [deleteLoading,setDeleteLoading] = useState(false)
  const [updateLoading,setUpdateLoading] = useState(false)
  const {enqueueSnackbar} = useSnackbar() 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateformData, [name]: value });
  };

  const handleUpdateRow = (id) => {
    setOpen(true);
  
    const bookToUpdate = books.find((book) => book._id === id);

    setUpdateFormData({
      title: bookToUpdate.title,
      author: bookToUpdate.author,
      genre: bookToUpdate.genre,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async (e,id) => {

    e.preventDefault();
   
    try {
      setUpdateLoading(true)
      const response = await axios.put(
        `${API_BASE_URL}/books/${id}`,
        updateformData
      );

     
      setBooks(response.data)
      setUpdateLoading(true)
      enqueueSnackbar("Book Updated Successfully",{variant:'success'})
      
    } catch (error) {

      console.log(error)
      setUpdateLoading(false)
      enqueueSnackbar(error.message,{variant: 'error'})
    }

    
    handleClose();
  };


  const handleDelete = async (id) => {
    
    try {
     
      setDeleteLoading(true);
      const response = await axios.delete(`${API_BASE_URL}/books/${id}`);
      setBooks(response.data) 
      enqueueSnackbar("Book Deleted Successfully",{variant: 'success'})
      setDeleteLoading(false);

      
     
    } catch (error) {
     
      enqueueSnackbar(error.message,{variant: 'error'})
      setDeleteLoading(false);

     
    } 
   
  };
  return (
    <>
    
    <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                      <TableCell align={"right"} style={{ minWidth: "170" }}>
                        {row.title}
                      </TableCell>
                      <TableCell align={"right"} style={{ minWidth: "170" }}>
                        {row.author}
                      </TableCell>
                      <TableCell align={"right"} style={{ minWidth: "170" }}>
                        {row.genre}
                      </TableCell>
                      <TableCell align={"right"} style={{ minWidth: "170" }}>
                        <Button variant='contained' onClick={() => handleUpdateRow(row._id)} style={{cursor:"pointer"}}>
                           Update
                        </Button>
                      </TableCell>
                      <TableCell align={"right"} style={{ minWidth: "170" }}>
                     

                        <Button variant='contained' startIcon={< DeleteIcon/>} onClick={()=>handleDelete(row._id)} style={{cursor:"pointer"}}>{deleteLoading? "Deleting..." : "Delete"}</Button>
                      </TableCell>
        </TableRow>
        
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={styles.dialog}
      >
        <form onSubmit={async (e) => await handleUpdate(e,row._id)}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={updateformData.title}
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
              value={updateformData.author}
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
              value={updateformData.genre}
              onChange={handleChange}
              placeholder="Enter book genre"
              required
              className={styles.input}
            />
          </div>
          <Button variant='contained' type="submit" className={styles.button}>
           {updateLoading ? "Updating..." :"Update"} 
          </Button>
        </form>
      </Dialog>

     

        </>

      
  )
}

export default TableRowCard
