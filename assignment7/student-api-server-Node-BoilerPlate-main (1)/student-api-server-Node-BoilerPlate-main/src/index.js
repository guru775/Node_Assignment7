const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const port = 8080;

app.use(express.urlencoded());

const studentsRecord = require("./InitialData");

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

let lastId = studentsRecord[studentsRecord.length - 1].id;
console.log("from global");
console.log(lastId);
// your code goes here
app.get("/api/student", (req, res) => {
  // console.log(studentsRecord);
  try {
    res.status(200).json({
      status: "ok",
      studentsRecord,
    });
  } catch (e) {
    res.json({
      status: "Error",
      message: e.message,
    });
  }
});

app.get("/api/student/:id", (req, res) => {
  console.log(req.params.id);

  let flag = false;

  try {
    for (let i = 0; i < studentsRecord.length; i++)
      if (req.params.id == studentsRecord[i].id) flag = studentsRecord[i];
    if (flag != false) {
      res.status(200).json({
        status: "ok",
        student: flag,
      });
    } else {
      res.status(404).json({
        status: "Failed",
        message: "Invalid id",
      });
    }
  } catch (e) {
    res.json({
      status: "Error",
      message: e.message,
    });
  }
});

app.post("/api/student", (req, res) => {
  try {
    res.header("Content-Type", "application/x-www-form-urlencoded");
    const { name, currentClass, division } = req.body;
    if (name != "" && currentClass != "" && division != "") {
      studentsRecord.push({
        id: parseInt(lastId) + 1,
        ...req.body,
      });
      lastId + 1;
      res.json({ lastId });
      return res.status(200).json({
        id: studentsRecord[studentsRecord.length - 1].id,
      });
    } else {
      res.status(400).json({
        status: "Not ok",
        message: "Student Details can't be empty",
      });
    }
  } catch (e) {
    res.json({
      status: "Error",
      message: e.message,
    });
  }
});
app.put("/api/student/:id", (req, res) => {
  console.log("from put");
  try {
    res.header("Content-Type", "application/x-www-form-urlencoded");
    let index = req.params.id,
      flag = false;
    for (let i = 0; i < studentsRecord.length; i++)
      if (index == studentsRecord[i].id) {
        flag = true;
        index = i;
        break;
      }
    if (flag) {
      const { name, currentClass, division } = req.body;
      if (name == "" || currentClass == "" || division == "")
        return res.status(400).json({
          status: "Not ok",
          message: "Student Details can't be empty",
        });
      else {
        studentsRecord[index].name = name;
        studentsRecord[index].currentClass = currentClass;
        studentsRecord[index].division = division;
        return res.status(200).json({
          status: "ok",
          updatedStudentDetails: studentsRecord[index],
        });
      }
    } else return res.status(400).json({ status: "id not exists" });
  } catch (e) {
    res.json({
      status: "Error",
      message: e.message,
    });
  }
});
app.delete("/api/student/:id", (req, res) => {
  lastId = studentsRecord[studentsRecord.length - 1].id;
  console.log("from delete");

  try {
    let index = req.params.id,
      flag = false;
    for (let i = 0; i < studentsRecord.length; i++)
      if (index == studentsRecord[i].id) {
        flag = true;
        index = i;
        break;
      }
    if (flag) {
      studentsRecord.splice(index, 1);
      return res.status(200).json({
        status: "ok",
        message: "student details deleted",
      });
    } else return res.status(400).json({ status: "id not exists" });
  } catch (e) {
    res.json({
      status: "Error",
      message: e.message,
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
