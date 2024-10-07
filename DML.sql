-- MEMBERS

-- Read from the Members Table
SELECT * FROM Members;

-- Add a Member
INSERT INTO `Members` (`memberEmail`, `memberName`, `joinDate`, `membershipTier`)
VALUES (:newMemberEmail, :newMemberName, :newJoinDate, :newMembershipTier);

-- Update a Member
UPDATE Members
SET memberEmail = :newMemberEmail,
    memberName = :newMemberName,
    joinDate = :newJoinDate,
    membershipTier = :newMembershipTier
WHERE memberID = :memberID

-- Delete a Member
DELETE FROM Members
WHERE memberID = :memberID



--BOOKS

-- Read from the Books Table
SELECT * FROM Books;

-- Add a Book
INSERT INTO `Books` (`title`, `author`, `isbn`, `genre`)
VALUES (:newTitle, :newAuthor, :newIsbn, :newGenre);

-- Update a Book
UPDATE Members
SET title = :newtitle,
    author = :newAuthor,
    isbn = :newIsbn,
    genre = :newGenre
WHERE bookID = :bookID

-- Delete a Book
DELETE FROM Books
WHERE bookID = :bookID



-- LOANS

-- Read from the Loans, LineItems, Members, Staff, and Books Tables
SELECT Loans.loanID, Books.Title, Books.Author, Books.isbn, Members.memberName, Staff.staffName, Loans.loanDate, LineItems.dueDate, LineItems.returnDate
FROM Loans
JOIN LineItems ON Loans.loanID = LineItems.loanID
JOIN Books ON LineItems.bookID = Books.bookID
JOIN Members ON Loans.memberID = Members.memberID
JOIN Staff ON Loans.staffID = Staff.staffID
ORDER BY Loans.loanID ASC;

-- Add a Loan
INSERT INTO `Loans` (`memberID`, `staffID`, `loanDate`)
VALUES (:selectedMemberID, :selectedStaffID, :newLoanDate);

-- Update a Loan
UPDATE Loans
SET memberID = :selectedMemberID
    staffID = :selectedStaffID,
    loanDate = :newLoanDate
WHERE loanID = :loanID

-- Delete a Loan
DELETE FROM Loans
WHERE loanID = :loanID



-- LINE ITEMS

-- Add a Line Item
INSERT INTO `LineItems` (`loanID`, `bookID`, `dueDate`, `returnDate`)
VALUES (
    :selectedLoanID,
    (SELECT bookID FROM Books WHERE Books.isbn = :enteredISBN),
    :newDueDate,
    NULL
);

-- Update a Line Item
UPDATE Loans
SET loanID = :selectedLoanID,
    bookID = (SELECT bookID FROM Books WHERE Books.isbn = :enteredISBN),
    dueDate = :newDueDate,
    returnDate = :newReturnDate
WHERE lineitemID = :lineitemID

-- Delete a Line Item
DELETE FROM LineItems
WHERE lineitemID = :lineitemID



-- STAFF

-- Read from the Staff Table
SELECT * FROM Staff;

-- Add Staff
INSERT INTO `Staff` (`staffName`, `position`, `staffEmail`)
VALUES (:newStaffName, :newPosition, :newStaffEmail);

-- Update Staff
UPDATE Staff
SET staffName = :newStaffName,
    position = :newPosition,
    staffEmail = :newStaffEmail
WHERE staffID = :staffID

-- Delete Staff
DELETE FROM Staff
WHERE staffID = :staffID