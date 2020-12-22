require("dotenv").config();
var express = require("express");
const axios = require("axios");
var router = express.Router();
const token = process.env.BOT_TOKEN;
var CronJob = require("cron").CronJob;
const url = `https://api.telegram.org/bot${token}`;


/* GET home page. */
router.get("/telebot", function (req, res, next) {
  res.send("hello world");
});

router.post("/", (req, res) => {
  const chatId = req.body.message.chat.id;
  console.log(req.body.message);
  const sentMessage = req.body.message.text;

  console.log(sentMessage);
  if (sentMessage.match(/hello/gi)) {
    axios
      .post(`${url}/sendMessage`, {
        chat_id: chatId,
        text: "hello back 👋",
      }).then((response) => { 
        res.status(200).send({});
      }).catch(function (error) {
        console.log(error);
      });

     
  } else if (sentMessage.match(/\/reminder/gi)) {
    let messageDate = new Date(sentMessage.substring(10, 26));
    if (messageDate <= new Date()) {
      axios
      .post(`${url}/sendMessage`, {
        chat_id: chatId,
        text: "Date cannot be in the past",
      }).then((response) => { 
        res.status(200).send({});
      }).catch(function (error) {
        console.log(error);
      });
    }
    
    else {
    let reminder = sentMessage.slice(27);
    console.log(`date is ${messageDate}, reminder is ${reminder}`);
    const job = new CronJob(messageDate, async () => {
      axios
        .post(`${url}/sendMessage`, {
          chat_id: chatId,
          text: reminder,
        })
        .catch(function (error) {
          console.log(error);
        });
    });

    job.start();
    axios
      .post(`${url}/sendMessage`, {
        chat_id: chatId,
        text: "reminder made",
      }).then((response) => { 
        res.status(200).send({});
      })
      .catch(function (error) {
        console.log(error);
      });

      return;
    }
  } else {
    // if no hello present, just respond with 200
    res.status(200).send({});
  }
});

module.exports = router;
