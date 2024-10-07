// Citation for the following functions:
// Date: 3/18/24
// Adapted from / Based on
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
// Code below is adapted from the example code given to fit the specific database used in this program.

// Get the objects we need to modify
let addStaffForm = document.getElementById('add-staff-form-ajax');

// Modify the objects we need
addStaffForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStaffName = document.getElementById("input-staffName");
    let inputposition = document.getElementById("input-position");
    let inputStaffEmail = document.getElementById("input-staffEmail");

    // Get the values from the form fields
    let staffNameValue = inputStaffName.value;
    let positionValue = inputposition.value;
    let staffEmailValue = inputStaffEmail.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: staffNameValue,
        position: positionValue,
        email: staffEmailValue
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-staff-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputStaffName.value = '';
            inputposition.value = '';
            inputStaffEmail.value = '';
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
    let currentTable = document.getElementById("staff-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let positionCell = document.createElement("TD");
    let emailCell = document.createElement("TD");

    let deleteCell = document.createElement("TD")

    // Fill the cells with correct data
    idCell.innerText = newRow.staffID;
    nameCell.innerText = newRow.staffName;
    positionCell.innerText = newRow.position;
    emailCell.innerText = newRow.staffEmail;

    deleteCell = document.createElement("button")
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function () {
        deleteMember(newRow.id);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(positionCell);
    row.appendChild(emailCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.staffID);

    // Add the row to the table
    currentTable.appendChild(row);

}