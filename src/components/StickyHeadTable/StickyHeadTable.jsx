import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import styles from "./StickyHeadTable.module.css";
import axios from "axios";
import { API_BASE_URL } from "../../config";

export default function StickyHeadTable({ books, setBooks, getAllBooks }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const [updateformData, setUpdateFormData] = React.useState({
    title: "",
    author: "",
    genre: "",
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData({ ...updateformData, [name]: value });
  };

  const handleUpdateRow = (id) => {
    setOpen(true);
    setId(id);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/books/${id}`,
        updateformData
      );

      alert("Data updated successfully")
      console.log(response.data);
      await getAllBooks();
    } catch (error) {
      alert("Error posting data:", error);
    }

 
    handleClose();
  };


  const handleDelete = async (id) => {
    try {
     
  
      const response = await axios.delete(`${API_BASE_URL}/books/${id}`);
      console.log(response.data);
      
      
      await getAllBooks();
    } catch (error) {
      console.log(error)
      alert("Error deleting data:", error);

     
    } 
  };


  React.useEffect(() => {
    getAllBooks();
  },[])
 

  return (
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow key={1}>
                <TableCell align={"right"} style={{ minWidth: "170" }}>
                  <b>Title</b>
                </TableCell>
                <TableCell align={"right"} style={{ minWidth: "170" }}>
                  <b>Author</b>
                </TableCell>
                <TableCell align={"right"} style={{ minWidth: "170" }}>
                  <b>Genre</b>
                </TableCell>

                <TableCell align={"right"} style={{ minWidth: "170" }}>
                  <b>Update</b>
                </TableCell>
                <TableCell align={"right"} style={{ minWidth: "170" }}>
                  <b>Delete</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {books
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
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
                        <button onClick={() => handleUpdateRow(row._id)} style={{cursor:"pointer"}}>
                          Update
                        </button>
                      </TableCell>
                      <TableCell align={"right"} style={{ minWidth: "170" }}>
                      { console.log("Deleting book with ID:", row._id)}

                        <button onClick={()=>handleDelete(row._id)} style={{cursor:"pointer"}}>Delete</button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form onSubmit={async (e) => await handleUpdate(e)}>
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
          <button type="submit" className={styles.button}>
           Update 
          </button>
        </form>
      </Dialog>
    </>
  );
}
