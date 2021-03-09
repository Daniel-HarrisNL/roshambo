const express = require('express');

const PORT = 3000;

let app = express();

app.use('/static', express.static('static'));

app.get('/', function(req,res){
        res.sendFile(__dirname + '/templates/index.html')
})

app.listen(PORT, ()=>{
        console.log(`Server is running on port ${PORT}`)
});