const fs = require('fs')
const dotenv = require('dotenv')
dotenv.config({path: '../.env' })

module.exports = {
    getMetricsPapersAws : async (request, response) => {
        try {
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
    },
    getMetricsGoogle : async (request, response) => {
        data = fs.readFileSync(process.env.PAPERS)
        data = JSON.parse(data)
        data = data.papers
        const url = 'https://us-central1-shaped-icon-390417.cloudfunctions.net/metricsPapers'
        const responseGoogle = await fetch(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        })
        const responseJson = await responseGoogle.json()
        return response.status(200).json(responseJson)
    },
    getMetricsPapersDigitalocean : async (request, response) => { // não está funcionando
        data = fs.readFileSync(process.env.PAPERS)
        data = JSON.parse(data)
        const url = 'https://faas-nyc1-2ef2e6cc.doserverless.co/api/v1/web/fn-72e3186e-a5ae-4dd8-8890-8c9ab664dcb7/default/metrics_papers'
        const response_digital = await fetch(url, {
            method: "post",
            body: JSON.stringify(data),
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Basic ODgzN2Q0OGMtYzgyMS00OWFlLWFmNDgtMDQ4MDQzMGY4MTk5OmVXcjZFbklXVnR6b24wcWRsT2FaM2s5UGlPT3V0cFUxSDQyejQ5ZlVaMWxGTjhaSlkzZU1oVW9KSUk3Z2h4cVo="
            },
        })
        const responseJson = await response_digital.json()
        return response.status(200).json(responseJson)
    }
}