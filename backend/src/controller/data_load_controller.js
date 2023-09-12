const model = require("../model/model")
const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path: '../.env' })

module.exports = {
    dataLoad : async(request, response) => {
        try {
            console.log("lendo arquivo com os papers...")
            data = fs.readFileSync(process.env.PAPERS)
            data = JSON.parse(data)

            console.log("Leitura dos arquivos JSON realizada com sucesso")
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
    },
    updateData : async(request, response) => {
        try {
            console.log("lendo arquivo com os novos papers...")
            let data = fs.readFileSync(process.env.PAPERS)
            data = JSON.parse(data)

            console.log("Leitura dos arquivos JSON realizada com sucesso")

            const filter = { query: data.query }
            const update = {
                $set: {
                    databases: data.databases,
                    limit: data.limit,
                    limit_per_database: data.limit_per_database,
                    number_of_papers: data.papers.length,
                    number_of_papers_by_database: data.papers.length,
                    papers: data.papers,
                    processed_at: data.processed_at,
                    publication_types: data.publication_types,
                    query: data.query,
                    since: data.since,
                    until: data.until
                }
            }
            const options = { upsert: true }

            console.log("Começando a inserir e atualizar os novos papers no banco....")
            const result = await model.updateMany(filter, update, options)
            console.log(result)
            return response.status(200).json({message: "Nova carga de dados realizada com sucesso"})
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    },
    getMetricsPapersAws : async (request, response) => {
        try {
            let result = await model.find()
            result = result.shift()
            result = result.papers
            const url = 'https://ezq21t35h9.execute-api.us-east-2.amazonaws.com/metrics'
            const response_aws = await fetch(url, {
                method: "post",
                body: JSON.stringify(result),
                headers: { "Content-Type": "application/json" },
            })
            const responseJson = await response_aws.json()
            return response.status(200).json(responseJson)
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    }
}