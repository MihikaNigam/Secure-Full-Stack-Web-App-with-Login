const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // parse requests of content-type - application/json

//routes
require('./routes/auth.routes')(app);

const port = 8000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});