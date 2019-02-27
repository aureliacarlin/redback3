require('dotenv').config();

let express = require('express');
let app = express();
let sequelize = require('./db')
let user = require('./controllers/usercontroller')
let list = require('./controllers/listcontroller')

const bodyParser = require('body-parser');
require("./config/associations");
app.use(bodyParser.json())
app.use(require('./middleware/headers'))
// sequelize.sync();
app.listen(process.env.PORT, function () {
    console.log('App is listening on 4000')
})

app.use('/user', user)
app.use('/yourlist', list)
