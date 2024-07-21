/*********************************************************************************
*  WEB700 – Assignment 3
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Huy Manh Le (Thomas Le) Student ID: hle37 Date: 2024/06/10
*
********************************************************************************/

const fs = require("fs");
const { resolve } = require("path");

class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

var dataCollection = null;

function initialize() {
    console.log("Initializing college data...")
    return new Promise((resolve, reject) => {
        let studentDataFromFile;
        let courseDataFromFile;

        fs.readFile("./data/students.json", "utf8", function (error, data) {
            if (error) {
                console.log(error);
                reject(error);
                return;
            }

            studentDataFromFile = JSON.parse(data);

            fs.readFile("./data/cources.json", "utf8", function (error, data) {
                if (error) {
                    console.log(error);
                    reject(error);
                    return;
                }

                courseDataFromFile = JSON.parse(data);

                dataCollection = new Data(studentDataFromFile, courseDataFromFile);
                resolve("Initialization successful!");
            })
        })
    });
}

function getAllStudent() {
    return new Promise((resolve, reject) => {
        if (dataCollection.students.length > 0) {
            resolve(dataCollection.students);
        } else {
            reject("No results returned");
        }
    });
}

function getStudentByFilter(filter) {
    return new Promise((resolve, reject) => {
        let result;
        getAllStudent()
            .then((students) => {
                result = Array.from(students).filter(filter);

                if (result.length > 0) {
                    resolve(result);
                } else {
                    reject("No results returned");
                }
            })
            .catch(result => reject(result));
    });
}

function getStudentByNum(input) {
    return new Promise((resolve, reject) => {
        try {
            number = parseInt(input);
            resolve(getStudentByFilter(o => o.studentNum === number));
        } catch (e) {
            reject("No results returned");
        }
    });
}

function getStudentByCourse(input) {
    return new Promise((resolve, reject) => {
        try {
            number = parseInt(input);
            resolve(getStudentByFilter(o => o.course === number));
        } catch (e) {
            reject("No results returned");
        }
    });
}

function getTAs() {
    return getStudentByFilter(o => o.TA === true);
}

function getCourses() {
    return new Promise((resolve, reject) => {
        if (dataCollection.courses.length > 0) {
            resolve(dataCollection.courses);
        } else {
            reject("No results returned");
        }
    });
}

function addStudent(student) {
    return new Promise((resolve, reject) => {
        if (!student.TA) {
            student.TA = false
        }
        student.studentNum = dataCollection.students.length + 1
        dataCollection.students.push(student)

        resolve("Student has been added!")

        // fs.writeFile("./data/students.json", JSON.stringify(dataCollection.students), function (error) {
        //     if (error) {
        //         console.log(error);
        //         reject(error);
        //         return;
        //     }

        //     resolve("Student has been added!")
        // })
    });
}

module.exports = {
    initialize,
    getAllStudent,
    getStudentByNum,
    getStudentByCourse,
    getTAs,
    getCourses,
    addStudent,
};