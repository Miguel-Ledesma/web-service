const fs = require('fs');
const express = require('express');
const service = express();
const mysql = require('mysql');
const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);
const connection = mysql.createConnection(credentials);

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});


connection.end()

// PORT THE PROGRAM IS ALIVE ON
const port = 5000;
service.listen(port, () => {
    console.log(`I am alive on port ${port}!`);
});