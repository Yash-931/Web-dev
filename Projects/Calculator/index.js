const express = require('express')

const app = express();

app.get("/", (req, res) => {
    res.sendFile("C:/Users/Yash.Aggarwal/Desktop/Web-dev/Projects/Calculator/index.html");
})

app.get("/sum/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);

    const sum = a + b;

    res.json({
        "ans": sum
    });
})

app.get("/mul/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);

    const sum = a * b;

    res.json({
        "ans": sum
    });
})

app.get("/sub/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);

    const sum = a - b;

    res.json({
        "ans": sum
    });
})

app.get("/div/:a/:b", (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);

    const sum = a / b;

    res.json({
        "ans": sum
    });
})

app.listen(3000);