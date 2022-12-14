const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (folder, content) =>
    fs.writeFile(folder, JSON.stringify(content, null, 4), err =>
    err ? console.error(err) : console.info(`\nData written to ${folder}`)
    );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

module.exports = {readFromFile, writeToFile, readAndAppend};