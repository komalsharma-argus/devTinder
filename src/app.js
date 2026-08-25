const express = require("express");
const app = express();

//?, + *
// app.get(/\/ab?cd/, (req, res) => {
//     res.send("GET request received!!");
// })

// app.get(/\/ab+cd/, (req, res) => {
//     res.send("GET request received!!");
// })

// app.get(/\/ab*cd/, (req, res) => {
//     res.send("GET request received!!");
// })

// app.get("/files/*path", (req, res) => {
//     res.send("GET request received!!");
// })

// app.get(/.*cd$/, (req, res) => {
//     res.send("GET request received!!");
// })

// app.get(/a/, (req, res) => {
//     res.send("GET request received!!");
// })

//req.query
//localhost:3000/user?id=123&status=active
// app.get("/user", (req, res) => {
//     console.log(req.query);
//     res.send("User query received");
// });

//req.params
//localhost:3000/user/123/active
// app.get("/user/:id/:status", (req, res) => {
//     console.log(req.params);
//     res.send("User params received");
// });

//Request Handlers
// app.use("/hello", (req, res) => {
//     res.send("Hello page");
// });

//Only handle get API calls 
// app.get("/user", (req, res) => {
//     res.send({"firstname": "Komal", "lastname": "Sharma"});
// });

//Only handle post API calls
// app.post("/user", (req, res) => {
//     res.send("Saving the data to the DB");
// });

//Only handle post API calls
// app.put("/user", (req, res) => {
//     res.send("New record added / record changed completely");
// });

//Only handle post API calls
// app.patch("/user", (req, res) => {
//     res.send("Made changes to few fields of existing record");
// });

//Only handle post API calls
// app.delete("/user", (req, res) => {
//     res.send("Deleted the record from the DB");
// });

//This will match all the HTTP method calls to /test
// app.use("/test", (req, res) => {
//     res.send("Test page");
// });

// app.use("/", (req, res) => {
//     res.send("Root page");
// });

app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000");
});