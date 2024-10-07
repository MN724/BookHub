// Citation for the following functions:
// Date: 3/18/24
// Adapted from / Based on
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
// Code below is adapted from the example code given to fit the specific database used in this program.

// Get the objects we need to modify
let updateMemberForm = document.getElementById('update-member-form-ajax');

// Modify the objects we need
updateMemberForm.addEventListener('submit', function (e) {
  // Prevent the form from submitting
  e.preventDefault();

  // Get form fields we need to get data from
  let inputMemberID = document.getElementById('idSelect');
  let inputMemberName = document.getElementById('input-memberName-update');
  let inputMemberEmail = document.getElementById('input-memberEmail-update');
  let inputMemberJoinDate = document.getElementById('input-joinDate-update');
  let inputMembershipTier = document.getElementById(
    'input-membershipTier-update'
  );

  // Get the values from the form fields
  let memberIDValue = inputMemberID.value;
  let memberNameValue = inputMemberName.value;
  let memberEmailValue = inputMemberEmail.value;
  let memberJoinDateValue = inputMemberJoinDate.value;
  let membershipTierValue = inputMembershipTier.value;

  // Put our data we want to send in a javascript object
  let data = {
    id: memberIDValue,
    name: memberNameValue,
    email: memberEmailValue,
    date: memberJoinDateValue,
    tier: membershipTierValue,
  };

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open('PUT', '/put-member-ajax', true);
  xhttp.setRequestHeader('Content-type', 'application/json');

  // Tell our AJAX request how to resolve
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      // Add the new data to the table
      updateRow(xhttp.response, memberIDValue);
      location.reload();
    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log('There was an error with the input.');
    }
  };

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));
});

function updateRow(data, memberID) {
  let parsedData = JSON.parse(data);

  let table = document.getElementById('members-table');

  for (let i = 0, row; (row = table.rows[i]); i++) {
    //iterate through rows
    //rows would be accessed using the "row" variable assigned in the for loop
    if (table.rows[i].getAttribute('data-value') == memberID) {
      // Get the location of the row where we found the matching person ID
      let updateRowIndex = table.getElementsByTagName('tr')[i];

      let td = updateRowIndex.getElementsByTagName('td')[1];
      td.innerHTML = parsedData[0].memberName;

      td = updateRowIndex.getElementsByTagName('td')[2];
      td.innerHTML = parsedData[0].memberEmail;

      td = updateRowIndex.getElementsByTagName('td')[3];
      td.innerHTML = parsedData[0].joinDate;

      td = updateRowIndex.getElementsByTagName('td')[4];
      td.innerHTML = parsedData[0].membershipTier;
    }
  }
}
