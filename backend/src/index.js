const express = require('express')
const cors = require("cors");
const app = express()
const data_load_router = require("./router/data_load_router")

app.use(express.json())
app.use(cors())
app.use(data_load_router)

app.listen(3333, ()=>{
    console.log('Servidor rodando....')
})