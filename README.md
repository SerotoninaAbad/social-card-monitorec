# Social Card for monitorec.app

Generate an open graph image for twitter/facebook/etc

## Deploy Your Own

_Live Example: https://social-card-monitorec.now.sh/api_

- Create a table in Airtable, you can create a table using this CSV file: [DailyTotals](https://github.com/SerotoninaAbad/covid19-csv-examples/blob/master/DailyTotals-Grid.csv)

- Add the following enviroment variables to `/.env`

```
  API_AIRTABLE_PATH=/v0/appo8EvYg4prTdP9h/YourTableName?view=Grid%20view&filterByFormula=isLastRecord%3D1
  AIRTABLE_KEY=YourAirtableKey
```

### Deploying From Your Terminal

You can deploy your new Custom Built project with a single command from your terminal using [Now CLI](https://zeit.co/download):

```shell
$ now
```
