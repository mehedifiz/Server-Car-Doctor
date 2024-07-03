const express = require('express');
const cors = require('cors')
const app = express();

const port = process.env.port || 5000;

// middleware 

app.use(express.json())
app.use(cors());



app.get('/', (req ,res)=>{
    res.send('Server is runnng ')
})

app.listen(port ,() =>{
    console.log(`car server running on port ${port} `  )
})