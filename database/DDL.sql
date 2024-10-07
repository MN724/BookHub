-- Begin by disabling foreign key checks and autocommit to ensure smooth import
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop tables if they exist to avoid errors during schema creation
DROP TABLE IF EXISTS `Loans`;
DROP TABLE IF EXISTS `Books`;
DROP TABLE IF EXISTS `Members`;
DROP TABLE IF EXISTS `Staff`;
DROP TABLE IF EXISTS `LineItems`;

-- Creation of the Members table
CREATE TABLE `Members` (
  `memberID` INT AUTO_INCREMENT PRIMARY KEY,
  `memberName` VARCHAR(255) NOT NULL,
  `memberEmail` VARCHAR(255) NOT NULL,
  `joinDate` DATE NOT NULL,
  `membershipTier` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creation of the Books table
CREATE TABLE `Books` (
  `bookID` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255),
  `isbn` VARCHAR(17) UNIQUE,
  `genre` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creation of the Staff table
CREATE TABLE `Staff` (
  `staffID` INT AUTO_INCREMENT PRIMARY KEY,
  `staffName` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255),
  `staffEmail` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creation of the Loans table with CASCADE on update and delete
CREATE TABLE `Loans` (
  `loanID` INT AUTO_INCREMENT PRIMARY KEY,
  `memberID` INT,
  `staffID` INT,
  `loanDate` DATE NOT NULL,
  FOREIGN KEY (`memberID`) REFERENCES `Members`(`memberID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`staffID`) REFERENCES `Staff`(`staffID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Creation of the LineItems table
CREATE TABLE `LineItems` (
  `lineitemID` INT AUTO_INCREMENT PRIMARY KEY,
  `loanID` INT,
  `bookID` INT,
  `dueDate` DATE NOT NULL,
  `returnDate` DATE,
  FOREIGN KEY (`loanID`) REFERENCES `Loans`(`loanID`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`bookID`) REFERENCES `Books`(`bookID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- Insert sample data into the Members table
INSERT INTO `Members` (`memberName`, `memberEmail`, `joinDate`, `membershipTier`) VALUES
('John Doe', 'jdoe@example.com', '2022-01-06', 'Gold'),
('Alice Smith', 'asmith@example.com', '2022-03-12', 'Silver'),
('Bob Johnson', 'bjohnson@example.com', '2022-07-22', 'Bronze');

-- Insert sample data into the Books table
INSERT INTO `Books` (`title`, `author`, `isbn`, `genre`) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-07-43273-56-5', 'Classic'),
('To Kill a Mockingbird', 'Harper Lee', '978-00-61120-08-4', 'Fiction'),
('1984', 'George Orwell', '978-04-51524-93-5', 'Dystopian');

-- Insert sample data into the Loans table
INSERT INTO `Loans` (`memberID`, `staffID`, `loanDate`) VALUES
(2, 1, '2024-01-10'),
(1, 1, '2024-01-12'),
(3, 2, '2024-01-15');

-- Insert sample data into the Staff table
INSERT INTO `Staff` (`staffName`, `position`, `staffEmail`) VALUES
('Emily Stone', 'Librarian', 'estone@example.com'),
('Michael Burnham', 'Library Assistant', 'mburnham@example.com'),
('Sarah Connor', 'Cataloguer', 'sconnor@example.com');

-- Insert sample data into the LineItems table
INSERT INTO `LineItems` (`loanID`, `bookID`, `dueDate`, `returnDate`) VALUES
(2, 2, '2024-01-24', NULL),
(3, 1, '2024-01-26', NULL),
(1, 3, '2024-01-29', NULL);

-- Re-enable foreign key checks and commit the transactions
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
