//jshint
var api_data = require('./keys.js');

const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
// const axios = require("axios");
const app = express();
const path = require("path");

// const user_already_alert = require("./public/js/script.js");

//serve static pages
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // console.log("HI");
  res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
});
// console.log(__dirname);

//post request to the contact of subscribers
app.get("/home.html", async function (req, res) {
  // console.log("HI");

  res.sendFile(__dirname + "/public/html/home.html");
});

app.post("/api/signup/", async function (req, res) {
  console.log("hi");
  // console.log(req.body);
  // checking if mail already exists
  const sub = req.body.email;
  const urrl =
    "https://us12.api.mailchimp.com/3.0/lists/"+ api_data.unique_id + "/members/" + sub;

  const opt = {
    method: "GET",
    auth: "muskan1:"+api_data.mail_api,
  };
  // const response = await https.get(urrl, opt);
  // console.log(response);

  const resp = https.get(urrl, opt, function (response) {
    //console.log(response);
    response.on("data", function (data) {
      var dataa = JSON.parse(data);
      console.log(dataa);
      if (dataa.status == "subscribed") {
        console.log(dataa.status);
        console.log("yes");
        // res.sendFile(path.join(__dirname, "public", "html", "signup.html"));
        //res.end();
        res.json({ status: "ok" });
        // res.redirect(path.join(__dirname, "public", "html", "signup.html"));
      } else {
        const firstname = req.body.fname;
        const lastname = req.body.lname;
        const email = req.body.email;

        const data = {
          members: [
            {
              email_address: email,
              status: "subscribed",
              merge_fields: {
                FNAME: firstname,
                LNAME: lastname,
              },
            },
          ],
        };

        const jsonData = JSON.stringify(data);

        const url = "https://us12.api.mailchimp.com/3.0/lists/" + api_data.unique_id;

        const options = {
          method: "POST",
          auth: "muskan1:" + api_data.mail_api,
        };

        const request = https.request(url, options, function (response) {
          console.log(response.statusCode);
          if (response.statusCode === 200) {
            res.json({ status: "bad" });
            //res.redirect(__dirname + "/public/html/home.html");
            // res.sendFile(__dirname + "/public/html/home.html");
          } else {
            res.json({ status: "ok" });
            // res.sendFile(__dirname + "/signup.html");
          }
          response.on("data", function (data) {
            // console.log(JSON.parse(data));
            // console.log(response.statusCode);
          });
        });
        request.write(jsonData);
        request.end();
      }
    });
  });
});

app.listen(3000, function () {
  console.log("server is running at 3000");
});

app.post("/api/login/", function (req, res) {
  console.log("ok reached");
  //res we need to send
  //req we received from the user
  const sub = req.body.email;
  const ff = req.body.fname;
  const ll = req.body.lname;
  const url =
    "https://us12.api.mailchimp.com/3.0/lists/" + api_data.unique_id + "/members/" + sub;
  //console.log(url);
  const options = {
    method: "GET",
    auth: "muskan1:" + api_data.mail_api,
  };
  const resp = https.get(url, options, function (response) {
    response.on("data", function (data) {
      console.log(JSON.parse(data));
      var data = JSON.parse(data);
      console.log(response.statusCode);
      if (data.full_name === ff + " " + ll && data.email_address === sub) {
        // alert("Logged in successfully")
        res.json({ status: "ok" });
        // res.sendFile(__dirname + "/public/html/home.html");
        //res.send("There is an error, please try again!");
      } else {
        // alert("Error in credentials, please try again!");
        res.json({ status: "failed" });
        // res.sendFile(__dirname + "/public/html/login.html");
      }
    });
  });
});

app.post("/api/search/", function (req, res) {
  console.log("ok reached");
  const query = req.body.key;
  console.log(query);
  const url = `https://youtube.googleapis.com/youtube/v3/search?key=`+ api_data.yt_api+ `&q=${query}&maxResults=3&type=video`;
  const options = {
    method: "GET",
    //auth: "",
  };
  const resp = https.get(url, options, function (response) {
    response.on("data", async function (data) {
      // console.log(JSON.parse(data));
      // console.log(JSON.parse(data));
      // console.log(data);
      const dataa = await JSON.parse(data);
      console.log("data to be send");
      const items = dataa.items;
      res.json(items);
      // console.log(data.items[0].etag);
    });
  });
});
