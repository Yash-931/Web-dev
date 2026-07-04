const axios = require("axios");

axios.post("https://httpdump.app/dumps/cc188e5d-e00d-480c-b148-6ffcf3e0fa34",
    {
        username: "yash",
        password: "aggarwal"
    },
    {
        headers: {
            Authorization: "Bearer 123"
        }
    }
)

fetch("https://httpdump.app/dumps/cc188e5d-e00d-480c-b148-6ffcf3e0fa34", 
    {
        method: "POST",
        headers: {
            Authorization: "Bearer 321"
        },
        body: JSON.stringify({
                name: "Yash",
                age: 21
        })
    }
)