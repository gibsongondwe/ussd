const fs = require("fs");
const readline = require("readline");
const path = require("path");
const bcrypt = require("bcrypt");

const saltRounds = 10;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function clearScreen() {
  console.clear();
}

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (input) => resolve(input));
  });
}

async function main() {
  clearScreen();
  console.log("What do you want to do");
  console.log("\n1. Register an account");
  console.log("2. Register Aget");
  console.log("3. Login to account");
  const opt = parseInt(await prompt("\nYour choice: "), 10);

  if (opt === 1) {
    clearScreen();
    // Registration logic...
    const password = await prompt("Enter your new password:\t");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const ac = await prompt("Enter your account number:\t");
    const phone = await prompt("Enter your phone number:\t");
    const balance = 0;
    const filename = path.join(__dirname, `${phone}.dat`);
    const userData = { ac, phone, password: hashedPassword, balance };
    fs.writeFileSync(filename, JSON.stringify(userData));
    console.log("\nAccount successfully registered");
  } else if (opt === 2) {
    clearScreen();
    // Registration logic...
    const password = await prompt("Enter your new password:\t");
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const phone = await prompt("Enter your phone number:\t");
    const balance = 0;
    const generateId = () => {
      // return Math.floor(Math.random() * Date.now());
      return Math.floor(100000 + Math.random() * 900000);
    };
    const id = generateId();
    const filenameaget = path.join(__dirname, `${id}.dat`);
    const userData = { id, phone, password: hashedPassword, balance };
    fs.writeFileSync(filenameaget, JSON.stringify(userData));
    console.log(`Account successfully created. Your Aget code is: ${id}`);
    // console.log("\nAccount successfully registered");
  } else if (opt === 3) {
    clearScreen();
    // Login logic...
    const phone = await prompt("\nPhone number:\t");
    const pword = await prompt("Password:\t");
    const filename = path.join(__dirname, `${phone}.dat`);
    if (!fs.existsSync(filename)) {
      console.log("\nAccount number not registered");
      return; // Exit if the account is not registered
    }
    const usr = JSON.parse(fs.readFileSync(filename, "utf8"));
    const match = await bcrypt.compare(pword, usr.password);
    if (!match) {
      console.log("\nIncorrect password");
      return; // Exit if the password is incorrect
    }
    console.log(`\nWelcome ${usr.phone}`);
    // Transaction logic...
    // Utility function to generate a unique ID

    let cont = "y";
    while (cont === "y") {
      clearScreen();

      console.log("\n1. Check balance");
      console.log("2. Deposit an amount");
      console.log("3. Withdraw");
      console.log("4. Transfer the balance");
      console.log("5. Make payments");
      console.log("6. Change password");

      const choice = parseInt(await prompt("\nYour choice:\t"), 10);
      // Implement cases for each transaction option
      let amount;
      switch (choice) {
        case 1:
          console.log(`\nYour current balance is Kw.${usr.balance.toFixed(2)}`);
          break;

        case 2:
          const amount = parseFloat(await prompt("\nEnter the amount:\t"));
          if (isNaN(amount) || amount <= 0) {
            console.log("\nInvalid amount. Please enter a positive number.");
            break;
          }
          usr.balance += amount;
          const transId = Date.now(); // Using the current timestamp as a simple transaction ID
          const timestamp = new Date(); // Creating a new date object for the current time
          const transactionDate = timestamp.toLocaleString();
          fs.writeFileSync(filename, JSON.stringify(usr));
          console.log(
            `\nSuccessfully deposited. Transaction ID: ${transId} Amount: ${amount.toFixed(
              2
            )} Date: ${transactionDate}`
          );
          break;
        case 3:
          const transID = Date.now(); // Unique transaction ID based on the current timestamp
          const agetCode = await prompt(
            "\nPlease Enter Aget code to transfer to: "
          );
          const amountWithdraw = parseFloat(
            await prompt("\nEnter the amount:\t")
          );

          if (isNaN(amountWithdraw) || amountWithdraw <= 0) {
            console.log("\nInvalid amount. Please enter a positive number.");
            break;
          }
          const filenameaget  = path.join(__dirname, `${id}.dat`);
          if (amountWithdraw > usr.balance) {
            console.log("\nInsufficient balance for withdrawal.");
            break;
          }
          const id = agetCode();
          usr.balance -= amountWithdraw;
          if (id) {
            id.balance += amountWithdraw; // Update the balance of the retrieved user object
          } else {
            console.log("\nInvalid Aget code. Transaction cancelled.");

            usr.balance += amountWithdraw; // Refund the amount to the original user's balance
            break;
          }

          const newDate = new Date().toLocaleString(); // Current date and time
          fs.writeFileSync(filename, JSON.stringify(usr)); // Save the updated user object
          // If there's a separate file for the other user, save their updated object as well
          console.log(`\nTransaction ID: ${transID}`);
          console.log(`Amount Withdrawn: $${amountWithdraw.toFixed(2)}`);
          console.log(`Date of Transaction: ${newDate}`);
          console.log(`Total Remaining Balance: $${usr.balance.toFixed(2)}`);
          console.log("\nSuccessfully withdrawn.");
          break;
        // case 3:
        //   const transID = Date.now(); // Unique transaction ID based on the current timestamp
        //   const agetCode = await prompt("\nPlease Enter Aget code to transfer to: ");
        //   const amountWithdraw = parseFloat(await prompt("\nEnter the amount:\t"));

        //   if (isNaN(amountWithdraw) || amountWithdraw <= 0) {
        //     console.log("\nInvalid amount. Please enter a positive number.");
        //     break;
        //   }
        //   if (amountWithdraw > usr.balance) {
        //     console.log("\nInsufficient balance for withdrawal.");
        //     break;
        //   }

        //   usr.balance -= amountWithdraw;
        // // Assuming 'id' is another user object, it should be defined and retrieved before this point
        // const id = agetCode();
        //   id.balance += amountWithdraw; // Make sure 'id' is the correct user object

        //   const newDate = new Date().toLocaleString(); // Current date and time
        //   fs.writeFileSync(filename, JSON.stringify(usr));
        //   console.log(`\nTransaction ID: ${transID}`);
        //   console.log(`Amount Withdrawn: $${amountWithdraw.toFixed(2)}`);
        //   console.log(`Date of Transaction: ${newDate}`);
        //   console.log(`Total Remaining Balance: $${usr.balance.toFixed(2)}`);
        //   console.log("\nSuccessfully withdrawn.");
        //   break;
        // case 3:
        //   const transID = Date.now(); // Unique transaction ID based on the current timestamp
        //   const amountWithdrawid  = await prompt(
        //     "\nPlease Enter Aget code to transfer to: "
        //   );
        //   const amountWithdraw = parseFloat(
        //     await prompt("\nEnter the amount:\t")
        //   );
        //   if (amountWithdraw > usr.balance) {
        //     console.log("\nInsufficient balance for withdrawal.");
        //     break;
        //   }
        //   usr.balance -= amountWithdraw;
        //   id.balance += amountWithdraw;

        //   const newDate = new Date().toLocaleString(); // Current date and time
        //   fs.writeFileSync(filename, JSON.stringify(usr));
        //   console.log(`\nTransaction ID: ${transID}`);
        //   console.log(`Amount Withdrawn: $${amountWithdraw.toFixed(2)}`);
        //   console.log(`Date of Transaction: ${newDate}`);
        //   console.log(`Total Remaining Balance: $${usr.balance.toFixed(2)}`);
        //   console.log("\nSuccessfully withdrawn.");
        //   break;

        case 4:
          const transferPhone = await prompt(
            "\nPlease enter the phone number to transfer to: "
          );
          const transferAmount = parseFloat(
            await prompt("\nPlease enter amount to transfer: ")
          );
          if (isNaN(transferAmount) || transferAmount <= 0) {
            console.log("\nInvalid amount. Please enter a positive number.");
            break;
          }
          const transferFilename = path.join(__dirname, `${transferPhone}.dat`);

          if (!fs.existsSync(transferFilename)) {
            console.log("\nAccount number not registered");
          } else {
            const usr1 = JSON.parse(fs.readFileSync(transferFilename, "utf8"));
            if (transferAmount > usr.balance) {
              console.log("\nInsufficient balance");
            } else {
              usr1.balance += transferAmount;
              fs.writeFileSync(transferFilename, JSON.stringify(usr1));
              usr.balance -= transferAmount;
              const userFilename = path.join(__dirname, `${usr.phone}.dat`);
              fs.writeFileSync(userFilename, JSON.stringify(usr));
              const transId = Date.now(); // Unique transaction ID
              const transactionDate = new Date(transId).toLocaleString(); // Formatted date and time
              console.log(
                `\nYou have successfully transferred Kw.${transferAmount.toFixed(
                  2
                )}. Transaction ID: ${transId}. Date: ${transactionDate}. Your new balance is Kw.${usr.balance.toFixed(
                  2
                )}`
              );
            }
          }
          break;

        case 5:
          const paymentPhone = await prompt(
            "\nPlease enter the phone number to pay to: "
          );
          const paymentAmount = parseFloat(
            await prompt("\nPlease enter amount to pay: ")
          );
          const paymentFilename = path.join(__dirname, `${paymentPhone}.dat`);

          if (!fs.existsSync(paymentFilename)) {
            console.log("\nAccount number not registered");
          } else {
            const usr1 = JSON.parse(fs.readFileSync(paymentFilename, "utf8"));
            if (paymentAmount > usr.balance) {
              console.log("\nInsufficient balance");
            } else {
              usr1.balance += paymentAmount;
              fs.writeFileSync(paymentFilename, JSON.stringify(usr1));
              usr.balance -= paymentAmount;
              fs.writeFileSync(filename, JSON.stringify(usr));
              console.log(
                `\nYou have successfully paid Kw.${paymentAmount.toFixed(
                  2
                )} to ${paymentPhone}`
              );
            }
          }
          break;
        case 6:
          const newPassword = await prompt(
            "\nPlease enter your new password: "
          );
          const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds); // Hash the new password
          usr.password = hashedNewPassword; // Update the password in the user object
          const userFilename = path.join(__dirname, `${usr.phone}.dat`);
          fs.writeFileSync(userFilename, JSON.stringify(usr)); // Write the updated user object to file
          console.log("\nPassword successfully changed");
          break;
        // ... Implement other cases similarly ...
      }
      // ... Implement other cases similarly ...
      // ...
      cont = await prompt(
        "\nDo you want to continue transaction? Press [y/n]: "
      );
    }
  }
  rl.close(); // Close the readline interface after all operations
}

main();
