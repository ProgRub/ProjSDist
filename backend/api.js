var mysql = require('mysql2');
const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD
}
const mysqlConnection = mysql.createConnection(config); 
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
      //bulletinboard:1.0
      // mysqlConnection.query(`CREATE DATABASE IF NOT EXISTS \`bulletin-board\` DEFAULT CHARACTER SET utf8mb4`);
      // mysqlConnection.query(`USE \`bulletin-board\`;`);
      // mysqlConnection.query(`DROP TABLE IF EXISTS \`event\`;`);
      // mysqlConnection.query("CREATE TABLE `event` (\
      //   `id` int(11) NOT NULL AUTO_INCREMENT,\
      //   `title` varchar(300) DEFAULT NULL COMMENT 'Event''s title',\
      //   `detail` varchar(500) DEFAULT NULL COMMENT 'Event''s description',\
      //   `category` varchar(300) DEFAULT NULL COMMENT 'Event''s category',\
      //   `date` date NOT NULL COMMENT 'Event''s date',\
      //   PRIMARY KEY(id)\
      // ) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
      // mysqlConnection.query("INSERT INTO `event` (`id`, `title`, `detail`, `category`, `date`) VALUES\
      // (1, 'Docker Workshop', 'Linuxing in London', 'Work', '2017-11-21'),\
      // (2, 'WinOps #17', 'WinOps London', 'Work', '2017-11-28'),\
      // (3, 'Gaming Tournament', 'RLCS Majors', 'Fun', '2021-11-4');");

      //bulletinboard:2.0
      mysqlConnection.query(`USE \`bulletin-board\`;`);
      res.sendStatus(200);
    }
  });
  
}