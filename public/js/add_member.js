// Citation for the following functions:
// Date: 3/18/24
// Adapted from / Based on
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
// Code below is adapted from the example code given to fit the specific database used in this program.

// Get the objects we need to modify
let addMemberForm = document.getElementById('add-member-form-ajax');

// Modify the objects we need
addMemberForm.addEventListener('submit', function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputMemberName = document.getElementById('input-memberName');
  let inputMemberEmail = document.getElementById('input-memberEmail');
  let inputJoinDate = document.getElementById('input-joinDate');
  let inputMembershipTier = document.getElementById('input-membershipTier');

  // Get the values from the form fields
  let memberNameValue = inputMemberName.value;
  let memberEmailValue = inputMemberEmail.value;
  let joinDateValue = inputJoinDate.value;
  let membershipTierValue = inputMembershipTier.value;

  // Put our data we want to send in a javascript object
  let data = {
    name: memberNameValue,
    email: memberEmailValue,
    date: joinDateValue,
    tier: membershipTierValue,
  };
  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/add-member-ajax', true);
  xhttp.setRequestHeader('Content-type', 'application/json');

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      addRowToTable(xhttp.response);

      // Clear the input fields for another transaction
      inputMemberName.value = '';
      inputMemberEmail.value = '';
      inputJoinDate.value = '';
      inputMembershipTier.value = '';
      location.reload();
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log('There was an error with the input.');
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

// Creates a single row from an Object representing a single record from
// bsg_people
addRowToTable = data => {
  // Get a reference to the current table on the page and clear it out.
  let currentTable = document.getElementById('members-table');

  // Get the location where we should insert the new row (end of table)
  let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (last object)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1];

  // Create a row and 4 cells
  let row = document.createElement('TR');
  let idCell = document.createElement('TD');
  let nameCell = document.createElement('TD');
  let emailCell = document.createElement('TD');
  let dateCell = document.createElement('TD');
  let tierCell = document.createElement('TD');

  let deleteCell = document.createElement('TD');

  // Fill the cells with correct data
  idCell.innerText = newRow.memberID;
  nameCell.innerText = newRow.memberName;
  emailCell.innerText = newRow.memberEmail;
  dateCell.innerText = newRow.joinDate;
  tierCell.innerText = newRow.membershipTier;

  deleteCell = document.createElement('button');
  deleteCell.innerHTML = 'Delete';
  deleteCell.onclick = function () {
    deleteMember(newRow.id);
  };

  // Add the cells to the row
  row.appendChild(idCell);
  row.appendChild(nameCell);
  row.appendChild(emailCell);
  row.appendChild(dateCell);
  row.appendChild(tierCell);
  row.appendChild(deleteCell);

  row.setAttribute('data-value', newRow.memberID);

  // Add the row to the table
  currentTable.appendChild(row);
};
