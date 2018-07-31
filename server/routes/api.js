const express = require('express');
const URLUtility = require('../helpers/URLUtility');
const config = require('../config/server_config.json');

const router = express.Router();

let burrow_url = "";

if (process.env.BURROW_HOME) {
  burrow_url = process.env.BURROW_HOME;
}
else {
  burrow_url = config.burrow.home;
}

console.log("Burrow URL: " + burrow_url);

const url = new URLUtility(burrow_url);


/* GET api listing. */
// Burrow Home
router.get('/burrow/home', (req, res) => {
  url.GetBase(function (err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send("ERROR: Something Strange Happened");
    }
  });
});

// Cluster Home
router.get('/burrow/cluster/:cluster', (req, res) => {
  let URL = "/" + req.params["cluster"];

  url.Get(URL, function (err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send("ERROR: Something Strange Happened");
    }
  });
});

// Cluster Consumer Home
router.get('/burrow/cluster/:cluster/consumer', (req, res) => {
  let URL = "/" + req.params["cluster"] + "/consumer";

  url.Get(URL, function (err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send("ERROR: Something Strange Happened");
    }
  });
});

// Cluster Consumer Lag/Status
router.get('/burrow/cluster/:cluster/consumer/:consumer', (req, res) => {
  let URL = "/" + req.params["cluster"] + "/consumer/" + req.params["consumer"] + "/lag";

  url.Get(URL, function (err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send("ERROR: Something Strange Happened");
    }
  });
});

// Cluster Topic Home
router.get('/burrow/cluster/:cluster/topic', (req, res) => {
  let URL = "/" + req.params["cluster"] + "/topic";

  url.Get(URL, function (err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send("ERROR: Something Strange Happened");
    }
  });
});

// Burrow Topic
router.get('/burrow/cluster/:cluster/topic/:topic', (req, res) => {
  let URL = "/" + req.params["cluster"] + "/topic/" + req.params["topic"];

  url.Get(URL, function (err, body) {
    if (!err) {
      res.send(body);
    } else {
      res.send("ERROR: Something Strange Happened");
    }
  });
});

router.get('*', (req, res) => {
  res.send('{ "ERROR" : "Invalid API Call" }');
});

module.exports = router;
