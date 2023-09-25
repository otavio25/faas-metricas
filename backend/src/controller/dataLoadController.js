const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path: '../.env' })

module.exports = {
    getMetricsPapersAws : async (request, response) => {
        try {
            console.log("lendo arquivo com os papers...")
            data = fs.readFileSync(process.env.PAPERS)
            data = JSON.parse(data)
            data = data.papers
            const url = 'https://ezq21t35h9.execute-api.us-east-2.amazonaws.com/metrics'
            const response_aws = await fetch(url, {
                method: "post",
                body: JSON.stringify(data),
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