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
service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
});

service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
});

service.get("/use.html", (request, response) => {
    response.sendFile('use.html', {root: "use"});
});

function rowToLog(row) {
    return {
        id: row.id,
        artist: row.artist,
        album: row.album,
        albumYear: row.albumYear,
        song: row.song,

    }
}

// GET /artists should display number of albums artist has saved here

service.get('/artists', (request, response) => {
    const query = "SELECT artist, COUNT(Artist) AS 'Entries' FROM Music GROUP BY Artist";
    connection.query(query, (error, rows) => {
        if (error) {
            response.status(500);
            response.json ({
                ok: false,
                results: 'oops, something when wrong here.',
            });
        }
        else {
            // MIGHT NEED TO PUT const log = row.map(rowToLog); HERE
            response.json ({
                ok: true,
                results: rows.map(rowToLog)
            });
        }

    });
});


connection.end()

// PORT THE PROGRAM IS ALIVE ON
const port = 8443;
service.listen(port, () => {
    console.log(`I am alive on port ${port}!`);
});