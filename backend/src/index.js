const express = require('express')
const cors = require("cors");
const app = express()
const dataLoadRouter = require("./router/dataLoadRouter")

app.use(express.json())
app.use(cors())
app.use(dataLoadRouter)

app.listen(3333, ()=>{
    console.log('Servidor rodando....')
})