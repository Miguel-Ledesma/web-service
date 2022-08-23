DROP TABLE IF EXISTS Music;
CREATE TABLE Music (
    id SERIAL PRIMARY KEY,
    artist VARCHAR(32),
    artistDesc TEXT,
    album VARCHAR(32),
    albumYear INT,
    song VARCHAR(32)
);