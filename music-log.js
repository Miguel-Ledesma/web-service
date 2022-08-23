const express = require(express);
const artistCounts = {};
const service = express();
const fs = require('fs');
const request = require('https');
const json = fs.readFileSync('credentials.json', 'utf8');
const mysql = require('mysql');
const credentials = JSON.parse(json);

service.use(express.json());

service.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    next();
});

service.options('*', (request, response) => {
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    response.sendStatus(200);
  });

const connection = mysql.createConnection(credentials);
connection.connect(error => {
    if (error) {
        console.error(error);
        process.exit(1);
    }
});

function rowToLog(row) {
    return {
        id: row.id,
        artist: row.artist,
        artistDesc: row.artistDesc,
        album: row.album,
        albumYear: row.albumYear,
        song: row.song,

    }
}

service.get("/use.html", (request, response) => {
    response.sendFile('use.html', {root: "use"});
});



// TODO: add endpoints

// GET /artists should display number of albums artist has saved here

service.get('artists', (request, response) => {
    const query = "SELECT * FROM Music";
    connection.query(query, (error, rows) => {
        if (error) {
            response.status(500);
            response.json ({
                ok: false,
                results: error.message,
            });
        }
        else {
            response.json ({
                ok: true,
                results: rows.map(rowToLog)
            });
        }

    });
});

const port = 5000;
service.listen(port, () => {
    console.log(`Live on port ${port}!`);
});