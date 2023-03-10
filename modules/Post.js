const fs = require("fs");
const md5 = require("md5");
const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../config/config").getConnection();
const multer = require("multer");
const path = require("path");
const os = require("os");
const checkAuth = require("../middleware/check-auth");
const ampq = require("amqplib/callback_api");


router.post("/save", (req, res) => {
  let email = db.escape(req.body.Email)
  let pass = db.escape(req.body.Password)

  // Got the attributes from front end
  // Check if a user exists with same email
  let promiseOne = new Promise((resolve, reject) => {
    let sql1 = `SELECT * FROM users WHERE email = ${email}`;
    let query1 = db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Some Error Occured in Checking Email",
        });
      }
      if (result.length > 0) {
        reject("Email Already exists.");
        process.on('unhandledRejection', (reason, p) => {
          console.error(reason);
        });
      }
      resolve(result);
    });
  });
  promiseOne.then(
    (data) => {
      // No Email Found With this Email

      let sql2 = `INSERT INTO users (email, password) VALUES (${email}, ${pass})`;
      let query2 = db.query(sql2, (err1, result) => {
        if (err1) {
          console.log(err1);
          return res.status(500).json({
            message: "Some Error Occured in Checking Email",
          });
        }
        return res.status(200).json({
          message: "Success",
        });
      });
    },
     (error) => {
        // Email Found with given Email
        return res.status(500).json({
        message: error,
        });
      }
      );
    });

  router.post("/login", (req, res) => {
    let email = db.escape(req.body.Email)
    let pass = db.escape(req.body.Password)


    let sql1 = `SELECT * FROM users WHERE email = ${email} and password = ${pass}`;
    let query1 = db.query(sql1, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Some Error Occured in Checking Email",
        });
      }

      if (result.length > 0) {
        return res.status(200).json({
          valid: true
        })
      }
      else {
        return res.status(200).json({
          valid: false
        })
      }
    })


  })


module.exports = router;
