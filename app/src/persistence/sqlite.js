const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, err => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                "CREATE TABLE IF NOT EXISTS `event` (                `id` int(11) NOT NULL,                `title` varchar(300) DEFAULT NULL COMMENT 'Event''s title',                `detail` varchar(500) DEFAULT NULL COMMENT 'Event''s description',                `category` varchar(300) DEFAULT NULL COMMENT 'Event''s category',                `date` date NOT NULL COMMENT 'Event''s date'              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
                (err, result) => {
                    if (err) return rej(err);
                    acc();
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM event', (err, rows) => {
            if (err) return rej(err);
            acc();
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM event WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc();
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        console.log(item);
        db.run(
            'INSERT INTO event (`id`, `title`, `detail`, `category`, `date`) VALUES (NULL, ?, ?,?,?)',
            [ item.title, item.detail ,item.category,item.date],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE event SET name=?, detail=?, category=?, date=? WHERE id=?',
            [item.title,  item.detail ,item.category,item.date,id],
            err => {
                if (err) return rej(err);
                acc();
            },
        );
    });
} 

async function removeItem(id) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM event WHERE id = ?', [id], err => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
