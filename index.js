const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { uuid } = require('uuidv4');

fs.readFile(
  'fixtures/options.csv',
  {
    encoding: 'utf-8'
  },
  (err, data) => {
    if (err) {
      throw err;
    }

    let rows = data.split(/(?:\r\n|\n)+/).filter((row) => row.length != 0);
    const headers = rows[1].split(',').map((header) => header.toLowerCase());

    rows = rows.splice(2);
    const options = buildOptions(rows);
    console.log(options);

    function buildOptions(rows) {
      let options = [];

      for (let i = 0; i < rows.length; i++) {
        let option = {};
        let score = {};
        let optionArray = [];

        if (rows[i].includes(`"`)) {
          const splitScore = rows[i].split(`"`);
          let question = splitScore[0].replace(',', '');
          let answer = splitScore[1];
          optionArray.push(question, answer);

          const scoreArray = splitScore[2].split(',');

          for (let j = 1; j < scoreArray.length; j++) {
            optionArray.push(scoreArray[j]);
          }
        } else {
          optionArray = rows[i].split(`,`);
        }

        for (let j = 0; j < optionArray.length; j++) {
          if (optionArray[j] === '' || optionArray[j] === ',') {
            continue;
          }

          if (j === 0) {
            option[headers[j]] = optionArray[j];
            // console.log(headers[j], optionArray[j]);
            continue;
          }

          if (j === 1) {
            option['answer'] = optionArray[j];
            // console.log('answer', optionArray[j]);
            continue;
          }
          // console.log(headers[j], optionArray[j]);
          score[headers[j]] = parseInt(optionArray[j]);
        }

        option.id = uuidv4();
        option['score'] = score;
        options.push(option);
      }
      return options;
    }
  }
);
