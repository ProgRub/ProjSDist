var mysql = require('mysql2');
const config = {
  host: 'mysql-development',
  user: 'root',
  password: 'secret',
  database: 'bulletin-board'
}
// const {
//   MYSQL_HOST: HOST,
//   MYSQL_HOST_FILE: HOST_FILE,
//   MYSQL_USER: USER,
//   MYSQL_USER_FILE: USER_FILE,
//   MYSQL_PASSWORD: PASSWORD,
//   MYSQL_PASSWORD_FILE: PASSWORD_FILE,
//   MYSQL_DB: DB,
//   MYSQL_DB_FILE: DB_FILE,
// } = process.env;
// const config = {
//   host: MYSQL_HOST,
//   user: MYSQL_USER,
//   password: MYSQL_PASSWORD,
//   database: MYSQL_DB
// };
const mysqlConnection = mysql.createConnection(config); //added the line
exports.getAllEvents = function (req, res) {
  mysqlConnection.query('SELECT * from `event`', function (err, results, fields) {
    res.json(results);
  })
};

exports.addEvent = function (req, res) {
  // console.log(req.body.title);
  // console.log(req.body.detail);
  // console.log(req.body.date);
  // console.log(req.body.category);
  mysqlConnection.query(`INSERT INTO event (id,title,detail,category,date) VALUES(DEFAULT,'${req.body.title}','${req.body.detail}','${req.body.category}','${req.body.date}')`,function(err,results,fields){
    console.log(err);
    console.log(results);
    res.json(results);
  });
  // res.sendStatus(200);
};
exports.deleteEvent = function (req, res) {
  console.log(req.params.eventId);
  mysqlConnection.query(`DELETE FROM event WHERE id=${req.params.eventId}`,function(err,results,fields){
    console.log(err);
    console.log(results);
  });
  res.sendStatus(200);
};

exports.connection = function (req, res) {
  mysqlConnection.connect(function (err) {
    if (err) {
      console.log('error connecting:' + err.stack);
      res.sendStatus(500);
    } else {
      console.log('connected successfully to DB.');
      res.sendStatus(200);
    }
  });
}