module.exports.handler = async (event) => {
  try {
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
    event.forEach(item => {
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${result_metrics}`
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error! ${error.message}`
      }),
    }
  }
};
