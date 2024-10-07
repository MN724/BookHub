// Citation for the following functions:
// Date: 3/18/24
// Adapted from / Based on
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
// Code below is adapted from the example code given to fit the specific database used in this program.

// Get the objects we need to modify
let updateStaffForm = document.getElementById('update-staff-form-ajax');

// Modify the objects we need
updateStaffForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputStaffID = document.getElementById("idSelect");
    let inputStaffName = document.getElementById("input-staffName-update");
    let inputposition = document.getElementById("input-position-update");
    let inputStaffEmail = document.getElementById("input-staffEmail-update");

    // Get the values from the form fields
    let staffIDValue = inputStaffID.value;
    let staffNameValue = inputStaffName.value;
    let positionValue = inputposition.value;
    let staffEmailValue = inputStaffEmail.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    /*     if (isNaN(homeworldValue)) 
        {
            return;
        } */


    // Put our data we want to send in a javascript object
    let data = {
        id: staffIDValue,
        name: staffNameValue,
        position: positionValue,
        email: staffEmailValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-staff-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, staffIDValue);
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, staffID) {
    let parsedData = JSON.parse(data);

    let table = document.getElementById("staff-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == staffID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td = updateRowIndex.getElementsByTagName("td")[1];
            td.innerHTML = parsedData[0].staffName;

            td = updateRowIndex.getElementsByTagName("td")[2];
            td.innerHTML = parsedData[0].position;

            td = updateRowIndex.getElementsByTagName("td")[3];
            td.innerHTML = parsedData[0].staffEmail;

        }
    }
}
