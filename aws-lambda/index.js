const natural = require('natural')

module.exports.handler = async (event) => {
  try {
    if (!event || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Entrada inválida!',
        }),
      };
    }

    let data = JSON.parse(event.body)

    const stopWords = [
      "the", "a", "an", "is", "are", "like", "alike", "about", "be", "may", "can", "assumed", "full", "do", "has", "self",
      "in", "on", "at", "of", "as", "to", "with", "by", "for", "from", "into", "onto", "upon", "over", "under", "both", "use",
      "through", "between", "among", "during", "before", "after", "beside", "around", "behind", "above", "below", "beyond", "make",
      "and", "or", "but", "because", "if", "when", "although", "since", "while", "unless", "however", "therefore", "all", "made",
      "nevertheless", "furthermore", "moreover",
      "I", "me", "you", "he", "him", "she", "her", "it", "we", "us", "they", "them", "show", "now", "being", "less", "does", "not",
      "my", "mine", "your", "yours", "his", "her", "hers", "its", "our", "ours", "their", "theirs", "than", "run", "runing", "local",
      "who", "whom", "whose", "what", "which", "why", "where", "when", "how", "any", "form", "also", "etc", "no", "yes",
      "this", "that", "used", "based"
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
            if (!stopWords.includes(word) && !groupedByYear[year].includes(word)) {
                groupedByYear[year].push(word)
            }
        })
    })

    let year
    const wordCountMap = {}
    const resultMetrics = []
    for (const yearKey of Object.keys(groupedByYear)) {
      year = yearKey
      groupedByYear[year].forEach((word) => {
        if (!wordCountMap[word]) {
          wordCountMap[word] = 1
        } else {
          wordCountMap[word]++
        }
      })

      const sortedWords = Object.keys(wordCountMap).sort(
        (a, b) => wordCountMap[b] - wordCountMap[a]
      )
  
      const topWords = sortedWords.slice(0, 15); // Pegue as 15 palavras mais frequentes
      resultMetrics.push({ [year]: topWords })
    }

    return resultMetrics

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error! ${error.message}`
      }),
    }
  }
};
