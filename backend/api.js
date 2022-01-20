const { Pool } = require('pg')

var pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  host: process.env.POSTGRES_HOST,
})
exports.getAllEvents = async function (req, res) {
  try {
    var results = await pool.query('SELECT * from event');
    res.json(results.rows);
  } catch (error) {
    console.log(error);
  }
};

exports.addEvent = async function (req, res) {
  try {
    var results = await pool.query(`INSERT INTO event (title,detail,category,date) VALUES('${req.body.title}','${req.body.detail}','${req.body.category}','${req.body.date}') RETURNING id`);
    console.log(results.rows[0].id);
    res.json(results.rows[0].id);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};
exports.deleteEvent = async function (req, res) {
  console.log(req.params.eventId);
  try {
    var results = await pool.query(`DELETE FROM event WHERE id=${req.params.eventId}`);
    console.log(results);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.connection = async function (req, res) {
  try {
    await pool.query(`CREATE DATABASE bulletinboard ENCODING 'UTF8'`);
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
      host: process.env.POSTGRES_HOST,
      database: "bulletinboard"
    })
    await pool.query(`DROP TABLE IF EXISTS event;`);
    await pool.query("CREATE TABLE event (\
          id SERIAL PRIMARY KEY,\
          title varchar(300) DEFAULT NULL,\
          detail varchar(500) DEFAULT NULL ,\
          category varchar(300) DEFAULT NULL,\
          date date NOT NULL\
        );");
    await pool.query("INSERT INTO event (title, detail, category, date) VALUES\
        ('Docker Workshop', 'Linuxing in London', 'Work', '2017-11-21'),\
        ('WinOps #17', 'WinOps London', 'Work', '2017-11-28'),\
        ('Gaming Tournament', 'RLCS Majors', 'Fun', '2021-11-4');");
  } catch (error) {
    pool = new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: 5432,
      host: process.env.POSTGRES_HOST,
      database: "bulletinboard"
    })
  }
  res.sendStatus(200);
  // }
  // });

}