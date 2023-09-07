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
            data["_id"] = data.query

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
                    filter: { _id: item.query }, // Filtrar pelo cve_id
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
            const {id} = request.query
            const result = await model.findById(id)

            data = result.papers
            

            const stopwords = [
                "the", "a", "an", "is", "are", "like", "alike", "about", "be", "may", "can", "assumed", "full", "do", "has", "self",
                "in", "on", "at", "of", "as", "to", "with", "by", "for", "from", "into", "onto", "upon", "over", "under", "both", "use",
                "through", "between", "among", "during", "before", "after", "beside", "around", "behind", "above", "below", "beyond", "make",
                "and", "or", "but", "because", "if", "when", "although", "since", "while", "unless", "however", "therefore", "all", "made",
                "nevertheless", "furthermore", "moreover", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
                "I", "me", "you", "he", "him", "she", "her", "it", "we", "us", "they", "them", "show", "now", "being", "less", "does", "not",
                "my", "mine", "your", "yours", "his", "her", "hers", "its", "our", "ours", "their", "theirs", "than", "run", "runing", "local",
                "who", "whom", "whose", "what", "which", "why", "where", "when", "how", "first", "second", "any", "form", "also", "etc", "no", "yes",
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
                "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
                "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
                "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
                "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
                "51", "52", "53", "54", "55", "56", "57", "58", "59", "60",
                "61", "62", "63", "64", "65", "66", "67", "68", "69", "70",
                "71", "72", "73", "74", "75", "76", "77", "78", "79", "80",
                "81", "82", "83", "84", "85", "86", "87", "88", "89", "90",
                "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
                "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
                "u", "v", "w", "x", "y", "z"
            ]
            const groupedByYear = {}
            const tokenizer = new natural.WordTokenizer()
            data.forEach(item => {
                const year = item.publication_date.split('-')[0];
                if (!groupedByYear[year]) {
                    groupedByYear[year] = []
                }
                const texts = item.abstract
                const tokens = tokenizer.tokenize(texts)

                tokens.forEach(token => {
                    const word = token.toLowerCase()
                    if (!stopwords.includes(word) && !groupedByYear[year].includes(word)) {
                        groupedByYear[year].push(word)
                    }
                })
            })

            const result_metrics = []
            for (const yearKey of Object.keys(groupedByYear)) {
                const year = yearKey
                result_metrics.push({ [year]: groupedByYear[year] })
            }

            return response.status(200).json(result_metrics)
        } catch (error) {
            console.log("O erro é: ", error.message)
            return response.status(500).json({error: 'Erro no servidor!'})
        }
    }
}