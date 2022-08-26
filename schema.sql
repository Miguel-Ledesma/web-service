DROP TABLE IF EXISTS Music;
CREATE TABLE Music (
    id SERIAL PRIMARY KEY,
    artist VARCHAR(32),
    album VARCHAR(32),
    albumYear INT,
    song VARCHAR(32),
    is_deleted INT DEFAULT 0
);