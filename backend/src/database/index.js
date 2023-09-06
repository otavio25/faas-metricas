const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: '../.env' })

mongoose.connect(`mongodb://root:example@${process.env.HOST}:27017/`).then(() => {
    console.log('Conectado com sucesso!')
}).catch((error) => {
    console.log("O erro é: ", error.message)
})
mongoose.Promise = global.Promise

module.exports = mongoose