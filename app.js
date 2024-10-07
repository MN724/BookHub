/*
    SETUP
*/
// Express
var express = require('express');
var app = express();

PORT = 5642;

// Database
var db = require('./database/db-connector');
console.log('db connected');
// Handlebars
const { engine } = require('express-handlebars');
app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main', // Specify your default layout
    layoutsDir: 'views/layouts/', // Specify the directory for layout files
    partialsDir: 'views/partials/', // Specify the directory for partials
  })
);
app.set('view engine', '.hbs');
app.set('views', './views'); // Specify the directory for views

// Serve static files
app.use(express.static('public'));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

app.get('/test', function (req, res) {
  res.send('Test page is working!');
});
// Routes
app.get('/', function (req, res) {
  res.render('index', { layout: 'main' }); // Use the 'main' layout
});

app.get('/index', function (req, res) {
  res.render('index', { layout: 'main' }); // Use the 'main' layout
});

// CRUD Operations for Members
// Read Members
app.get('/members', function (req, res) {
  let membersQuery = 'SELECT * FROM Members;';
  db.pool.query(membersQuery, (err, membersResult) => {
    if (err) {
      console.error('Error fetching members:', err);
      res.send('Error fetching members');
      return;
    }
    res.render('members', { members: membersResult });
  });
});

// Add new Member
app.post('/add-member-ajax', (req, res) => {
  let data = req.body;

  // Ensure the membername, memberEmail, and joinDate are provided

  // SQL query to insert a new member
  insertQuery = `
        INSERT INTO Members (memberName, memberEmail, joinDate, membershipTier)
        VALUES ('${data.name}', '${data.email}', '${data.date}', '${data.tier}');
    `;

  // Execute the query
  db.pool.query(insertQuery, (error, results) => {
    if (error) {
      console.error('Error adding new member:', error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on bsg_people
      displayQuery = `SELECT * FROM Members;`;
      db.pool.query(displayQuery, (error, results) => {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(results);
        }
      });
    }
  });
});

// Delete Member
app.delete('/delete-member-ajax/', function (req, res, next) {
  let data = req.body;
  let deleteMember = `DELETE FROM Members WHERE memberID = ?`;

  // Run the query
  db.pool.query(deleteMember, [data.id], (error, rows) => {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Update Member
app.put('/put-member-ajax', function (req, res) {
  let data = req.body;

  let queryUpdateMember = `
    UPDATE Members
    SET memberEmail = ?,
        memberName = ?,
        joinDate = ?,
        membershipTier = ?
    WHERE memberID = ?`;

  let selectMember = `SELECT * FROM Members WHERE memberID = ?`;

  // Run the 1st query
  db.pool.query(
    queryUpdateMember,
    [data.email, data.name, data.date, data.tier, data.id],
    (error, rows) => {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
      }

      // If there was no error, we run our second query and return that data so we can use it to update the people's
      // table on the front-end
      else {
        // Run the second query
        db.pool.query(selectMember, [data.id], (error, rows) => {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        });
      }
    }
  );
});

// CRUD Operations for Books
// Read Books
app.get('/books', function (req, res) {
  let booksQuery = 'SELECT * FROM Books;';
  db.pool.query(booksQuery, (err, booksReult) => {
    if (err) {
      console.error('Error fetching books:', err);
      res.send('Error fetching books');
      return;
    }
    res.render('books', { books: booksReult });
  });
});

// Add new Book
app.post('/add-book-ajax', (req, res) => {
  let data = req.body;

  // Ensure the membername, memberEmail, and joinDate are provided

  // SQL query to insert a new member
  insertQuery = `
        INSERT INTO Books (title, author, isbn, genre)
        VALUES ('${data.title}', '${data.author}', '${data.isbn}', '${data.genre}');
    `;

  // Execute the query
  db.pool.query(insertQuery, (error, results) => {
    if (error) {
      console.error('Error adding new book:', error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on bsg_people
      displayQuery = `SELECT * FROM Books;`;
      db.pool.query(displayQuery, (error, results) => {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(results);
        }
      });
    }
  });
});

// Delete Member
app.delete('/delete-book-ajax/', function (req, res, next) {
  let data = req.body;
  let deleteBook = `DELETE FROM Books WHERE bookID = ?`;

  // Run the query
  db.pool.query(deleteBook, [data.id], (error, rows) => {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Update Book
app.put('/put-book-ajax', function (req, res) {
  let data = req.body;

  let queryUpdateBook = `
    UPDATE Books
    SET title = ?,
        author = ?,
        isbn = ?,
        genre = ?
    WHERE bookID = ?`;

  let selectBook = `SELECT * FROM Books WHERE bookID = ?`;

  // Run the 1st query
  db.pool.query(
    queryUpdateBook,
    [data.title, data.author, data.isbn, data.genre, data.id],
    (error, rows) => {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
      }

      // If there was no error, we run our second query and return that data so we can use it to update the people's
      // table on the front-end
      else {
        // Run the second query
        db.pool.query(selectBook, [data.id], (error, rows) => {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        });
      }
    }
  );
});

// CRUD Operations for Staff
// Read Staff
app.get('/staff', function (req, res) {
  let booksQuery = 'SELECT * FROM Staff;';
  db.pool.query(booksQuery, (err, staffResult) => {
    if (err) {
      console.error('Error fetching staff:', err);
      res.send('Error fetching staff');
      return;
    }
    res.render('staff', { staff: staffResult });
  });
});

// Add new Staff
app.post('/add-staff-ajax', (req, res) => {
  let data = req.body;

  // Ensure the membername, memberEmail, and joinDate are provided

  // SQL query to insert a new member
  insertQuery = `
        INSERT INTO Staff (staffName, position, staffEmail)
        VALUES ('${data.name}', '${data.position}', '${data.email}');
    `;

  // Execute the query
  db.pool.query(insertQuery, (error, results) => {
    if (error) {
      console.error('Error adding new staff:', error);
      res.sendStatus(400);
    } else {
      // If there was no error, perform a SELECT * on bsg_people
      displayQuery = `SELECT * FROM Staff;`;
      db.pool.query(displayQuery, (error, results) => {
        // If there was an error on the second query, send a 400
        if (error) {
          // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
          console.log(error);
          res.sendStatus(400);
        }
        // If all went well, send the results of the query back.
        else {
          res.send(results);
        }
      });
    }
  });
});

// Delete Staff
app.delete('/delete-staff-ajax/', function (req, res, next) {
  let data = req.body;
  let deleteStaff = `DELETE FROM Staff WHERE staffID = ?`;

  // Run the query
  db.pool.query(deleteStaff, [data.id], (error, rows) => {
    if (error) {
      // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
      console.log(error);
      res.sendStatus(400);
    } else {
      res.sendStatus(204);
    }
  });
});

// Update Staff
app.put('/put-staff-ajax', function (req, res) {
  let data = req.body;

  let queryUpdateStaff = `
    UPDATE Staff
    SET staffName = ?,
        position = ?,
        staffEmail = ?
    WHERE staffID = ?`;

  let selectStaff = `SELECT * FROM Staff WHERE staffID = ?`;

  // Run the 1st query
  db.pool.query(
    queryUpdateStaff,
    [data.name, data.position, data.email, data.id],
    (error, rows) => {
      if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
      }

      // If there was no error, we run our second query and return that data so we can use it to update the people's
      // table on the front-end
      else {
        // Run the second query
        db.pool.query(selectStaff, [data.id], (error, rows) => {
          if (error) {
            console.log(error);
            res.sendStatus(400);
          } else {
            res.send(rows);
          }
        });
      }
    }
  );
});

// CRUD Operations for Loans
// Read Loans
app.get('/loans', (req, res) => {
  // Query to get Loans data with Member and Staff names
  const loansQuery = `
    SELECT Loans.loanID, Loans.loanDate, Members.memberID, Members.memberName, Staff.staffID, Staff.staffName
    FROM Loans
    JOIN Members ON Loans.memberID = Members.memberID
    JOIN Staff ON Loans.staffID = Staff.staffID
    ORDER BY Loans.loanID ASC;
  `;

  // Query to get Line Items data with Book details
  const lineItemsQuery = `
    SELECT LineItems.lineitemID, LineItems.loanID, LineItems.dueDate, LineItems.returnDate, 
           Books.bookID, Books.title, Books.author, Books.isbn
    FROM LineItems 
    JOIN Books ON LineItems.bookID = Books.bookID
    ORDER BY LineItems.lineitemID ASC;
  `;

  const booksQuery = `
    SELECT *
    FROM Books 
  `;

  const membersQuery = `
    SELECT *
    FROM Members 
  `;

  const staffQuery = `
    SELECT *
    FROM Staff 
  `;

  db.pool.query(loansQuery, (err, loansResult) => {
    if (err) {
      console.error('Error fetching loans:', err);
      res.send('Error fetching loans');
      return;
    }

    db.pool.query(lineItemsQuery, (err, lineItemsResult) => {
      if (err) {
        console.error('Error fetching line items:', err);
        res.send('Error fetching line items');
        return;
      }

      db.pool.query(booksQuery, (err, booksResult) => {
        db.pool.query(membersQuery, (err, membersResult) => {
          db.pool.query(staffQuery, (err, staffResult) => {
            res.render('loans', {
              loans: loansResult,
              lineItems: lineItemsResult,
              books: booksResult,
              members: membersResult,
              staff: staffResult,
            });
          });
        });
      });
    });
  });
});

// Create Loan
app.post('/addLoan', async (req, res) => {
  const { memberID, staffID, loanDate, bookID, dueDate } = req.body;

  // Start a transaction
  db.pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!

    connection.beginTransaction(err => {
      if (err) {
        throw err;
      }

      // Step 1: Insert the loan
      const insertLoanQuery =
        'INSERT INTO Loans (memberID, staffID, loanDate) VALUES (?, ?, ?)';
      connection.query(
        insertLoanQuery,
        [memberID, staffID, loanDate],
        (err, loanResult) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }

          const loanID = loanResult.insertId;

          // Step 2: Insert into LineItems for each book
          const insertLineItemQuery =
            'INSERT INTO LineItems (loanID, bookID, dueDate) VALUES (?, ?, ?)';
          connection.query(
            insertLineItemQuery,
            [loanID, bookID, dueDate],
            (err, lineItemResult) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }

              // Commit transaction
              connection.commit(err => {
                if (err) {
                  return connection.rollback(() => {
                    throw err;
                  });
                }
                console.log('Transaction Complete.');
                connection.release();
                res.redirect('/loans');
              });
            }
          );
        }
      );
    });
  });
});

// Add Book to Loan
app.post('/addBookToLoan', (req, res) => {
  const { loanID, bookID, dueDate } = req.body;

  // Ensure the loanID and bookID are provided
  if (!loanID || !bookID || !dueDate) {
    return res.status(400).send('Missing loanID, bookID, or dueDate.');
  }

  // SQL query to insert a new line item
  const insertQuery = `
        INSERT INTO LineItems (loanID, bookID, dueDate)
        VALUES (?, ?, ?);
    `;

  // Execute the query
  db.pool.query(insertQuery, [loanID, bookID, dueDate], (error, results) => {
    if (error) {
      console.error('Error adding book to loan:', error);
      return res.status(500).send('Error adding book to loan');
    }

    // Successfully added book to loan
    console.log('Added book to loan successfully:', results.insertId);
    res.redirect('/loans');
  });
});

// Update Loan
app.post('/updateLoan', (req, res) => {
  console.log('updateLoan');
  const { lineItemId, newMemberID, newStaffID, newLoanDate, newDueDate } =
    req.body;

  // First, find the loanID associated with the lineItemID
  const findLoanIdQuery = `SELECT loanID FROM LineItems WHERE loanID = ?`;

  db.pool.query(findLoanIdQuery, [lineItemId], (err, result) => {
    console.log(lineItemId);
    if (err) {
      console.error('Failed to find loanID:', err);
      return res.status(500).send('Failed to find associated loan');
    }

    // Ensure we found a loanID
    if (result.length === 0) {
      return res
        .status(404)
        .send('No associated loan found for the provided line item');
    }

    const loanID = result[0].loanID;

    // Update the Loans table with the retrieved loanID
    console.log(loanID);
    const updateLoanQuery = `
      UPDATE Loans
      SET memberID = ?, staffID = ?, loanDate = ?
      WHERE loanID = ?`;

    db.pool.query(
      updateLoanQuery,
      [newMemberID, newStaffID, newLoanDate, loanID],
      (err, results) => {
        if (err) {
          console.error('Failed to update loan:', err);
          return res.status(500).send('Failed to update loan');
        }

        // Assuming that the lineItemId uniquely identifies a LineItem for a specific loan, update the LineItems table
        const updateLineItemQuery = `
        UPDATE LineItems
        SET dueDate = ?
        WHERE lineitemID = ?`;

        db.pool.query(
          updateLineItemQuery,
          [newDueDate, lineItemId],
          (err, results) => {
            if (err) {
              console.error('Failed to update line item:', err);
              return res.status(500).send('Failed to update line item');
            }

            // If both updates are successful, redirect to the loans page
            res.redirect('/loans');
          }
        );
      }
    );
  });
});

// Delete Loan
app.post('/deleteLineItem', (req, res) => {
  console.log('deleteLineItem');
  const { lineItemID } = req.body;
  if (lineItemID) {
    const deleteLineItemQuery = 'DELETE FROM LineItems WHERE lineitemID = ?';
    db.pool.query(deleteLineItemQuery, [lineItemID], (error, results) => {
      if (error) {
        console.error('Error deleting line item:', error);
        return res.status(500).send('Error deleting line item');
      }
      console.log(`Line Item ${lineItemID} deleted successfully.`);
    });
  }
  res.redirect('/loans');
});

// Delete Loan
app.post('/deleteLoan', (req, res) => {
  const { loanID } = req.body;
  if (loanID) {
    const deleteLoanQuery = 'DELETE FROM Loans WHERE loanID = ?';
    db.pool.query(deleteLoanQuery, [loanID], (error, results) => {
      if (error) {
        console.error('Error deleting loan:', error);
        return res.status(500).send('Error deleting loan');
      }
      console.log(`Loan ${loanID} deleted successfully.`);
    });
  }
  res.redirect('/loans'); // Redirect after attempts to delete both line item and loan
});

// Listener
app.listen(PORT, function () {
  console.log(
    'Express started on http://localhost:' +
    PORT +
    '; press Ctrl-C to terminate.'
  );
});
