/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Huy Manh Le (Thomas Le)_ Student ID: hle37________ Date: 2024/07/16______
*
* Online (Heroku) Link: https://web700-assignment-4-hle37-f8e88693caba.herokuapp.com/
*
*********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();

// PATHS
const path = require('path');
const collegeData = require("./modules/collegeData.js");

// MIDDLEWARES
// app.use(express.static(__dirname))
app.use(express.static("./public/"));
app.use(express.urlencoded({ extended: true }));

// WEEK 8: MULTER

const multer = require("multer");

// multer requires a few options to be setup to store files with file extensions
// by default it won't store extensions for security reasons
const storage = multer.diskStorage({
    destination: "./public/photos/",
    filename: function (req, file, cb) {
        // we write the filename as the current date down to the millisecond
        // in a large web service this would possibly cause a problem if two people
        // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
        // this is a simple example.
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage });

// WEEK 9: HANDLEBARS

const exphbs = require("express-handlebars");

// Register handlebars as the rendering engine for views
app.engine(".hbs", exphbs.engine(
    {
        extname: ".hbs",
        helpers: {
            helper1: function (options) {
                // helper without "context", ie {{#helper}} ... {{/helper}}
            },
            helper2: function (context, options) {
                // helper with "context", ie {{#helper context}} ... {{/helper}}
            }
        }
    },
));
app.set("view engine", ".hbs");

//////////////////////////////////////////////////

var active = {
    home: false,
    about: false,
    demo: false,
    addStudent: false,
    register: false,
    viewData: false,
    students: false,
    tas: false,
    courses: false,
}

function setActiveMenu(tab) {
    Object.keys(active).forEach((key) => active[key] = false)
    active[tab] = true
}

// Get Home
app.get("/", (req, res) => {
    setActiveMenu("home")
    res.render('home', {
        active: active,
        layout: "layout"
    });
});

// Get About
app.get("/about", (req, res) => {
    setActiveMenu("about")
    res.render('about', {
        active: active,
        layout: "layout",
    });
});

// Get Demo
app.get("/htmlDemo", (req, res) => {
    setActiveMenu("demo")
    res.render('htmlDemo', {
        active: active,
        layout: "layout"
    });
});

// Get Add Student
app.get("/students/add", (req, res) => {
    setActiveMenu("addStudent")
    res.render('addStudent', {
        active: active,
        layout: "layout"
    });
});

// Post Add Student
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body).then(result => sendResponse(res, "Success!", result)).catch(error => sendResponse(res, "Error!", error))
});

// Get Students
app.get("/students", (req, res) => {
    course = req.query.course

    setActiveMenu("students")
    if (course) {
        collegeData.getStudentByCourse(course).then(result => {
            sendResponse(res, "Students In Course " + course, null, result)
        }).catch(error => sendResponse(res, "Error!", "no results"))
    } else {
        collegeData.getAllStudent().then(result => {
            sendResponse(res, "Students", null, result)
        }).catch(error => sendResponse(res, "Error!", "no results"))
    }
});

// Get Students by Number
app.get("/students/:num", (req, res) => {
    num = req.params.num

    setActiveMenu("students")
    if (num) {
        collegeData.getStudentByNum(num).then(result => {
            sendResponse(res, "Student No " + num, null, result)
        }).catch(error => sendResponse(res, "Error!", "no results"))
    } else {
        collegeData.getAllStudent().then(result => {
            sendResponse(res, "Students", null, result)
        }).catch(error => sendResponse(res, "Error!", "no results"))
    }
});

// Get TAs
app.get("/tas", (req, res) => {
    setActiveMenu("tas")
    collegeData.getTAs().then(result => {
        sendResponse(res, "Teaching Assistants", null, result)
    }).catch(error => sendResponse(res, "Error!", "no results"))
});

// Get Courses
app.get("/courses", (req, res) => {
    setActiveMenu("courses")
    collegeData.getCourses().then(result => {
        sendResponse(res, "Courses", null, null, result)
    }).catch(error => sendResponse(res, "Error!", "no results"))
});

// Catch Error
app.use((err, req, res, next) => {
    res.status(404).send("Page Not THERE, Are you sure of the path?");
});

// Send Response
function sendResponse(res, header, message, students, courses, code) {
    var data = {
        header: header,
        message: message,
        isStudentsVisible: students ? true : false,
        students: students,
        isCoursesVisible: courses ? true : false,
        courses: courses,
        code: code
    }

    res.render('response', {
        active: active,
        data: data,
        layout: "layout"
    });
}

// Setup HTTP Server to Listen on HTTP_PORT
collegeData.initialize()
    .then((result) => {
        console.log(result);
        app.listen(HTTP_PORT, () => console.log("server listening on port: " + HTTP_PORT));
    })
    .catch(error => console.log(error));

////////////////////////////////////////////////////////////////////////////////////////////////////
//////////EXAMPLES//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

// WEEK 8 EXAMPLES: FORM

app.get("/registerUser", function (req, res) {
    setActiveMenu("registerUser")
    res.render('registerUser', {
        active: active,
        layout: "layout"
    });
});

app.post("/register-user", upload.single("photo"), (req, res) => {
    const formData = req.body;
    const formFile = req.file;

    const dataReceived = "Your submission was received:<br/><br/>" +
        "Your form data was:<br/>" + JSON.stringify(formData) + "<br/><br/>" +
        "Your File data was:<br/>" + JSON.stringify(formFile) +
        "<br/><p>This is the image you sent:<br/><img src='/photos/" + formFile.filename + "'/>";
    res.send(dataReceived);
});

// WEEK 9 EXAMPLES: HANDLEBARS

app.get("/viewData", function (req, res) {
    setActiveMenu("viewData")

    var someData = [{
        name: "John",
        age: 23,
        occupation: "developer",
        company: "Scotiabank",
        visible: true
    },
    {
        name: "Sarah",
        age: 32,
        occupation: "manager",
        company: "TD",
        visible: false
    }];

    res.render('viewData', {
        data: someData,
        active: active,
        layout: "layout" // do not use the default Layout (main.hbs)
    });
});