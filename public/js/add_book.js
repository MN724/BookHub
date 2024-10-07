// Citation for the following functions:
// Date: 3/18/24
// Adapted from / Based on
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
// Code below is adapted from the example code given to fit the specific database used in this program.

// Get the objects we need to modify
let addBookForm = document.getElementById('add-book-form-ajax');

// Modify the objects we need
addBookForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputTitle = document.getElementById("input-title");
    let inputAuthor = document.getElementById("input-author");
    let inputISBN = document.getElementById("input-isbn");
    let inputGenre = document.getElementById("input-genre");

    // Get the values from the form fields
    let titleValue = inputTitle.value;
    let authorValue = inputAuthor.value;
    let isbnValue = inputISBN.value;
    let genreValue = inputGenre.value;

    // Put our data we want to send in a javascript object
    let data = {
        title: titleValue,
        author: authorValue,
        isbn: isbnValue,
        genre: genreValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-book-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputTitle.value = '';
            inputAuthor.value = '';
            inputISBN.value = '';
            inputGenre.value = '';
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("books-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let titleCell = document.createElement("TD");
    let authorCell = document.createElement("TD");
    let isbnCell = document.createElement("TD");
    let genreCell = document.createElement("TD");

    let deleteCell = document.createElement("TD")

    // Fill the cells with correct data
    idCell.innerText = newRow.bookID;
    titleCell.innerText = newRow.title;
    authorCell.innerText = newRow.author;
    isbnCell.innerText = newRow.isbn;
    genreCell.innerText = newRow.genre;

    deleteCell = document.createElement("button")
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteMember(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(isbnCell);
    row.appendChild(genreCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.bookID);

    // Add the row to the table
    currentTable.appendChild(row);

}