const { google } = require('googleapis');
const express = require('express');
const moment = require('moment');
const app = express();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('SlipSlap REST API listening on port', port);
});

app.get('/', async (req, res) => {
  const ingredient = await getAllRows();
  let retVal;
  if (ingredient) {
    retVal = {status: 'success', data: {ingredient: ingredient}};
  }
  else {
    res.status(404);
    retVal = {status: 'fail', data: {title: `Ingredient ${id} not found`}};
  }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(retVal));
});

async function getAllRows() {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const api = google.sheets({version: 'v4', auth});
  const response = await api.spreadsheets.values.get({
    spreadsheetId: '13xbC0cHcOmUq9fsu94ebcfVa7x0IeDIa7MmR4zUePRs',
    range: 'Sheet1'
  });

  let result = []
  let rowNum = 0
  for (let row of response.data.values) {
    if (rowNum++ === 0) continue
    //BOUGHT 100 C @ 49.35 (UXXX7281)
    let rData = row[1].split(" ")

    var format = "ddd, DD MMM YYYY HH:mm:ss Z"
    var dt = moment(row[0], format)

    result.push({
      symbol: rData[2],
      side: rData[0],
      qty: rData[1],
      price: rData[4],
      time: row[0],
      timeLong: dt.valueOf()/1000
    })

  }

  return result
}

app.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const ingredient = await getAllRowsBySymbol(symbol);
  let retVal;
  if (ingredient) {
    retVal = {status: 'success', data: {ingredient: ingredient}};
  }
  else {
    res.status(404);
    retVal = {status: 'fail', data: {title: `Ingredient ${id} not found`}};
  }
  res.setHeader('content-type', 'application/json');
  res.end(JSON.stringify(retVal));
});

async function getAllRowsBySymbol(symbol) {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  const api = google.sheets({version: 'v4', auth});
  const response = await api.spreadsheets.values.get({
    spreadsheetId: '13xbC0cHcOmUq9fsu94ebcfVa7x0IeDIa7MmR4zUePRs',
    range: 'Sheet1'
  });

  let result = []
  let rowNum = 0
  for (let row of response.data.values) {
    if (rowNum++ === 0) continue
    //BOUGHT 100 C @ 49.35 (UXXX7281)
    let rData = row[1].split(" ")

    var format = "ddd, DD MMM YYYY HH:mm:ss Z"
    var dt = moment(row[0], format)

    if (symbol === rData[2]) {
      result.push({
        symbol: rData[2],
        side: rData[0],
        qty: rData[1],
        price: rData[4],
        time: row[0],
        timeLong: dt.valueOf()/1000
      })
    }
  }

  return result
}