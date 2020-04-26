const express = require("express");
const bodyParser = require("body-parser");
const db = require("./database");
const user = require("./route/userRoute");
const admin = require("./route/adminRoute")
const parcel = require("./route/parcelRoute")

let app = express();
let port = 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.listen(port, () => {
    console.log(`Application is listening on port ${port}`);
});

app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to Verge couirer Api services"
    });
});


app.use("/api/v1", user);
app.use("/api/v1", admin)
app.use("/api/v1", parcel);
module.exports = app;