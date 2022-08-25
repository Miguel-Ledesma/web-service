const fs = require('fs');
const express = require('express');
const service = express();
const mysql = require('mysql');
const { request } = require('https');
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


// GET /artists should display all artists recorded

service.get('/artists', (request, response) => {
    const query = "SELECT artist FROM Music GROUP BY Artist";
    connection.query(query, (error, rows) => {
        if (error) {
            response.status(500);
            response.json ({
                ok: false,
                results: error.message,
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


// GET AN ARTIST'S ALBUMS AND THE SONG COUNT ON EACH ALBUM
service.get('/artists/:artist', (request, response) => {
    const parameters = [request.params.artist];
    const query = 'SELECT artist, album, COUNT(song) FROM Music WHERE Artist = ? GROUP BY album ORDER BY album';
    connection.query(query, parameters, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
                ok: false,
                results: 'invalid input, requires artist',
            });
        }
        else {
            // MIGHT NEED TO PUT const log = row.map(rowToLog); HERE
            response.json({
                ok: true,
                results: rows.map(rowToLog),
            });
        }
    });
});

// SEE ALL SONGS ON A PARTICULAR ALBUM BY PARTICULAR ARTIST
service.get('/artists/:artist/:album', (request, response) => {
    const parameters = [
        request.params.artist,
        request.params.album
    ];
    const query = 'SELECT artist, album, song FROM Music WHERE artist = ? AND album = ? ORDER BY song';

    connection.query(query, parameters, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
                ok: false,
                results: 'invalid input, requires artist and album',
            });
        }
        else {
            // MIGHT NEED TO PUT const log = row.map(rowToLog); HERE
            response.json({
                ok: true,
                results: rows.map(rowToLog),
            });
        }
    });
});

// GET ALL ARTIST AND ALBUMS THAT CAME OUT IN A PARTICULAR YEAR
service.get('/albums/:albumYear', (request, response) => {
    const parameters = [request.params.albumYear];
    const query = 'SELECT artist, album, COUNT(song) FROM Music WHERE albumYear = ? GROUP BY artist, album ORDER BY artist';

    connection.query(query, parameters, (error, rows) => {
        if (error) {
            response.status(500);
            response.json({
                ok: false,
                results: 'invalid year inserted, must be an integer',
            });
        }
        else {
            // MIGHT NEED TO PUT const log = row.map(rowToLog); HERE
            response.json({
                ok: true,
                results: rows.map(rowToLog),
            });
        }
    });
});

// UPLOAD INFROMATION ABOUT A SONG
service.post('/artists', (request, response) => {
    if (request.body.hasOwnProperty('artist') &&
    request.body.hasOwnProperty('album') &&
    request.body.hasOwnProperty('albumYear') &&
    request.body.hasOwnProperty('song')) {
        const parameters = [
            request.body.artist,
            request.body.album,
            parseInt(request.body.albumYear),
            request.body.song
        ];

        const query = 'INSERT INTO Music (artist, album, albumYear, song) VALUES (?, ?, ?, ?)';
        connection.query(query, parameters, (error, result) => {
            if (error) {
                response.status(500);
                response.json({
                    ok: false,
                    results: error.message,
                });
            }
            else {
                response.json({
                    ok: true,
                    results: result.insertId,
                });
            }
        });
    }
    else {
        response.status(400);
        response.json({
            ok: false,
            results: 'Insertion into database failed, a value is incorrect or not present',
        });
    }
});

// UPDATE ENTRY ALREADY IN DATABASE

service.patch('/artists/:id', (request, response) => {
    const parameters = [
        request.body.artist,
        request.body.album,
        parseInt(request.body.albumYear),
        request.body.song,
        parseInt(request.params.id)
    ]
    const query = 'UPDATE music SET artist = ?, album = ?, albumYear = ?, song = ? WHERE id = ?';

    connection.query(query, parameters, (error, result) => {
        if (error) {
            response.status(404);
            response.json({
                ok: false,
                results: 'update failed, check the values entered, order is artist, album, album year, song',
            });
        }
        else {
            response.json({
                ok: true
            });
        }
    });
})

// DELETE A RECORD WITH THE ID
service.delete('/artists/:id', (request, response) => {
    const parameters = [parseInt(request.params.id)];
    const query = 'DELETE FROM Music WHERE id = ?';

    connection.query(query, parameters, (error, result) => {
        if (error) {
            response.status(404);
            response.json({
                ok: false,
                results: 'failed to delete, parameter is wrong.'
            });
        }
        else {
            response.json({
                ok: true,
            });
        }
    });
});

//connection.end()

// PORT THE PROGRAM IS ALIVE ON
const port = 5001;
service.listen(port, () => {
    console.log(`I am alive on port ${port}!`);
});