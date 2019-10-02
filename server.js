const express = require("express");

let port = process.env.PORT || 5000;

app = express();
app.use(express.static(__dirname + "/dist"));
app.listen(port);
console.log("Server listening on port " + port);
