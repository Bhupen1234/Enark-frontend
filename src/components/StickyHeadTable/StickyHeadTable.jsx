import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import TableRowCard from "../TableRowCard/TableRowCard";

export default function StickyHeadTable({ books ,setBooks}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);


  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

 

  


 
 

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
              {
               

              
                  books
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                       <TableRowCard row={row} books={books}  setBooks={setBooks}/>
                      );
                     })
              
              }

           
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

     
    </>
  );
}
