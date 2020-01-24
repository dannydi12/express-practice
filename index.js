const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

app.get("/sum", (req, res) => {
  const { a, b } = req.query;
  if (!a || typeof a !== "number") {
    res.status(400).send("Please send a number");
  }
  if (!b || typeof b !== "number") {
    res.status(400).send("Please send a number");
  }

  const sum = parseInt(a) + parseInt(b);
  res.send(`The sum of ${a} and ${b} is ${sum}`);
});

// app.get("/cipher", (req, res) => {
//   let {text, shift} = req.query;

//   shift = parseInt(shift);
//   text = String(text).toLowerCase();

//   let cipher = [...text].map(letter => {
//     let letterCode = letter.charCodeAt(0);
//     if(letter.charCodeAt(0) >= 97 && letter.charCodeAt(0) <= 122) {
//       return String.fromCharCode(letterCode + shift);
//     }
//     return letter;
//   });

//   res.send(cipher.join(''))
// });

app.get('/cipher', (req, res) => {
  const { text, shift } = req.query;

  // validation: both values are required, shift must be a number
  if (!text) {
    return res
      .status(400)
      .send('text is required');
  }

  if (!shift) {
    return res
      .status(400)
      .send('shift is required');
  }

  const numShift = parseFloat(shift);

  if (Number.isNaN(numShift)) {
    return res
      .status(400)
      .send('shift must be a number');
  }

  const base = 'A'.charCodeAt(0);  // get char code 

  const cipher = text
    .toUpperCase()
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);

      if (code < base || code > (base + 26)) {
        return char;
      }

      // otherwise convert it
      // get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(''); // construct a String from the array

  // Return the response
  res
    .status(200)
    .send(cipher);
});

app.get('/lotto', (req, res) => {
  const { query } = req;

  if (!query.numbers) {
    res.status(400).send("Please check your query")
  }
  if (query.numbers.length !== 6) {
    res.status(400).send("Only send 6 numbers");
  }
  query.numbers.forEach(number => {
    if (!number) {
      res.status(400).send("No numbers in query")
    }
    if (number < 0 && number > 20) {
      res.status(400).send("Number needs to be in range of 1-20")
    }
  })

  const winning = [];
  for (let i = 0; i < 6; i++) {
    winning.push(Math.floor(Math.random() * (20 - 1) + 1));
  }

  console.log(winning)
  console.log(query.numbers)

  let matches = 0;
  query.numbers.forEach((number, i) => {
    if (parseInt(number) === winning[i]) {
      matches++;
    }
  });

  let message = '';

  switch (true) {
    case (matches < 4):
      message = 'Sorry, you lose';
      break;
    case matches === 4:
      message = 'Congratulations, you win a free ticket';
      break;
    case matches === 5:
      message = 'Congratulations! You win $100!';
      break;
    case matches === 6:
      message = 'Wow! Unbelievable! You could have won the mega millions!'
      break;
  }

  res.send(message);
})

app.listen(8000, () => {
  console.log("Express server is listening on port 8000!");
});
