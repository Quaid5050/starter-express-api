const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('rest api response from  Quaid Ahmed!')
})
app.listen(process.env.PORT || 3000)
