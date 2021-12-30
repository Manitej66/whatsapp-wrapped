export default function handler(req, res) {
  const { file } = req.body;

  const words = file.split("\n");
  const wordCount = {};
  words.forEach((word) => {
    if (wordCount[word]) {
      wordCount[word]++;
    } else {
      wordCount[word] = 1;
    }
  });
  const max = Math.max(...Object.values(wordCount));
  const mostUsedWord = Object.keys(wordCount).find(
    (word) => wordCount[word] === max
  );

  res.status(200).json({
    word: mostUsedWord,
    count: max,
  });
}
