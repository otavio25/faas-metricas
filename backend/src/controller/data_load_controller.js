const model = require("../model/model")
const fs = require('fs')
const natural = require('natural')
const dotenv = require('dotenv')
dotenv.config({path: '../.env' })

module.exports = {
    data_load : async(request, response) => {
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
    update_data : async(request, response) => {
        try {
            console.log("lendo arquivo com os novos papers...")
            data = fs.readFileSync(process.env.PAPERS)
            data = JSON.parse(data)

            console.log("Leitura dos arquivos JSON realizada com sucesso")

            let update_operation = data.map((item) => ({
                updateOne: {
                    filter: { query: item.query }, // Filtrar pelo cve_id
                    update: {
                        $set: {
                            databases: item.databases,
                            limit: item.limit,
                            limit_per_database: item.limit_per_database,
                            number_of_papers: item.number_of_papers,
                            number_of_papers_by_database: item.number_of_papers_by_database,
                            papers: item.papers,
                            processed_at: item.processed_at,
                            publication_types: item.publication_types,
                            query: item.query,
                            since: item.since,
                            until: item.until
                        }
                    },
                    upsert: true // Inserir se não existir
                }
            }))

            console.log("Começando a inserir e atualizar os novos papers no banco....")
            const result = await model.bulkWrite(update_operation)
            console.log(result)
            return response.status(200).json({message: "Nova carga de dados realizada com sucesso"})
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    },
    get_metrics_papers_aws : async (request, response) => {
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