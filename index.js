const express = require('express')
const axios = require('axios');
const fs = require('fs');
const { parseCSV } = require('./utils/parseCSV')
const cors = require('cors');

const app = express()
const port = 5678
const urlFindData = 'https://echo-serv.tbxnet.com/v1/secret/file'
const urlListFiles = 'https://echo-serv.tbxnet.com/v1/secret/files'
const Headers = {
    headers: {
        authorization: 'Bearer aSuperSecretKey',
        "Content-Type": "application/json"
    }
}

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => res.send('Hello ToolBox!'))

app.get('/files/list', async (req, res) => {
    const requestListFiles = await axios.get(urlListFiles, Headers)
        .then(function (response) {
            return response.data.files
        }).catch(function (error) {
            console.log(error);
        })

    try {
        res.send(requestListFiles);
    } catch (error) {
        res.status(500).send(error);
    }
})

app.get('/files/data', async (req, res) => {
    const fileName = req.query.fileName;

    const requestFindData = await axios.get(urlListFiles, Headers)
        .then(function (response) {
            return response.data.files
        }).catch(function (error) {
            console.log(error);
        })

    const dataPromises = requestFindData.map(element => {
        if (fileName) {
            if (element === fileName) {
                return axios.get(`${urlFindData}/${element}`, Headers)
                    .then(function (response) {
                        if (response && response.data) {
                            const json = parseCSV(response.data, element);
                            return json;
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
            }
        } else {
            return axios.get(`${urlFindData}/${element}`, Headers)
                .then(function (response) {
                    if (response && response.data) {
                        const json = parseCSV(response.data, element);
                        return json;
                    }
                }).catch(function (error) {
                    console.log(error);
                });
        }
    });

    Promise.all(dataPromises)
        .then(dataArray => {
            const filteredData = dataArray.filter(Boolean);
            if (filteredData.length > 0) {
                res.send(filteredData);
            } else {
                res.status(404).send(`No se encontró el archivo "${fileName}"`);
            }
        })
        .catch(error => {
            res.status(500).send(error);
        });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app;