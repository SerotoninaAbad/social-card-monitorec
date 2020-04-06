import { ServerResponse } from 'http';
import { LastDayStats } from './types';
const https = require('https');

export function getHtml(): Promise<string> {
  console.log(process.env.API_AIRTABLE_PATH);
  var reqOptions = {
    host: 'api.airtable.com',
    port: 443,
    path: process.env.API_AIRTABLE_PATH,
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_KEY}`,
    },
  };
  return new Promise(function (resolve, reject) {
    let request = https.get(reqOptions, function (res: ServerResponse) {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error('statusCode=' + res.statusCode));
        return;
      }

      var body = '';
      res.on('data', function (data: string) {
        body += data;
      });

      res.on('end', function () {
        const response = JSON.parse(body);
        const lastDay = response.records[0].fields;
        const html = getTemplate(lastDay);
        resolve(html);
      });

      res.on('error', function (e: Error) {
        console.log('Got error: ' + e.message);
      });
    });

    request.on('error', function (err: Error) {
      reject(err);
    });

    request.end();
  });
}

function getTemplate(lastDay: LastDayStats): string {
  return `
        <!doctype html>
        <html>
        <meta charset="utf-8" />
        <title>Generated Image</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
        ${getCss()}
        </style>
        <body>
          <div class="container">
            <div class="stats colorWarning borderColorWarning">
              <p class="number">
                ${lastDay.confirmed.toString()}
              </p>
              <h3 class="text">
                Confirmados
              </h3>
            </div>
            <div class="stats colorDanger borderColorDanger">
              <p class="number">
                ${lastDay.deaths.toString()}
              </p>
              <h3 class="text">
                Fallecidos
              </h3>
            </div>
            <div class="stats colorDanger borderColorDanger">
              <p class="number">
                ${lastDay.possibleDeaths.toString()}
              </p>
              <h3 class="text">
                'Posible' Fallecidos
              </h3>
            </div>
            <div class="stats colorPrimary borderColorPrimary">
              <p class="number">
              ${lastDay.suspicious.toString()}
              </p>
              <h3 class="text">
                Sospecha
              </h3>
            </div>
            <div class="stats colorPrimary borderColorPrimary">
              <p class="number">
              ${lastDay.negatives.toString()}
              </p>
              <h3 class="text">
                Descartados
              </h3>
            </div>
            <div class="stats colorPrimary borderColorPrimary">
              <p class="number">
              ${lastDay.recoveries.toString()}
              </p>
              <h3 class="text">
                Alta Hosp.
              </h3>
            </div>
          </div>
        </body>
      </html>
      `;
}

function getCss() {
  return `body {
    background-color: hsla(229, 19%, 16%, 1);
    font-family: Arial, Helvetica, sans-serif;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
  }
  .stats {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-end;
    border: 1px solid hsla(223, 13%, 11%, 1);
    padding: 1rem;
    margin: 0.5rem;
    flex: 1 1 0%;
  }
  .colorWarning {
    color: hsla(25, 100%, 67%, 1);
  }
  .borderColorWarning {
    border: 7px solid hsla(25, 100%, 67%, 1);
  }
  .colorDanger {
    color: hsla(0, 100%, 67%, 1);
  }
  .borderColorDanger {
    border: 7px solid hsla(0, 100%, 67%, 1);
  }
  .colorPrimary {
    color: hsla(163, 72%, 48%, 1);
  }
  .borderColorPrimary {
    border: 7px solid hsla(163, 72%, 48%, 1);
  }
  .number {
    font-size: 5.3rem;
    font-weight: 900;
    flex: 2 1 0%;
    margin-bottom: 0px;
    margin-top: 66px;
  }
  .text {
    font-size: 2.78rem;
    text-transform: uppercase;
    font-weight: 300;
    display: inline-block;
    margin: 0px;
    text-align: right;
  }`;
}
