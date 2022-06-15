const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  const test = {
    x: 8,
    y: 4
  }  

  res.send(test)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
