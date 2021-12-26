const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql');

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({ host, port: 3306 });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
    });

    return new Promise((acc, rej) => {
        pool.query(
            "CREATE TABLE IF NOT EXISTS `event` (                `id` int(11) NOT NULL,                `title` varchar(300) DEFAULT NULL COMMENT 'Event''s title',                `detail` varchar(500) DEFAULT NULL COMMENT 'Event''s description',                `category` varchar(300) DEFAULT NULL COMMENT 'Event''s category',                `date` date NOT NULL COMMENT 'Event''s date'              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;",
            err => {
                if (err) return rej(err);

                console.log(`Connected to mysql db at host ${HOST}`);
                acc();
            },
        );
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        pool.end(err => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM event', (err, rows) => {
            if (err) return rej(err);
            acc();
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM event WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc();
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        console.log(item);
        pool.query(
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
        pool.query(
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
        pool.query('DELETE FROM event WHERE id = ?', [id], err => {
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
