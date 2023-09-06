const model = require("../model/model")
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path: '../.env' })

module.exports = {
    data_load : async(request, response) => {
        try {
            console.log("lendo arquivo com os papers...")
            data = fs.readFileSync(process.env.PAPERS)
            data = JSON.parse(data)
            data = data.papers

            console.log("Leitura dos arquivo JSON realizada com sucesso")
            console.log("Começando a inserir os papers no banco....")

            model.insertMany(data).then(() => {
                console.log("Dados inseridos com sucesso")
                return response.status(200).json({message: "Carga de dados realizada com sucesso"})
            }).catch((error) => {
                console.log(error.message)
                return response.status(400).json({error: "Não foi possível popular o banco"})
            })
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    }
}