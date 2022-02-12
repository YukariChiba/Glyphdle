function genShare(guessedSeq, seq) {
  let txt = "Glyphdle (WIP) " + guessedSeq.length + "/20\n\n";
  guessedSeq.forEach((gSeq) => {
    gSeq.forEach((g, i) => {
      if (seq.includes(g)) {
        if (g === seq[i]) {
          txt = txt + "\uD83D\uDFE9";
        } else {
          txt = txt + "\uD83D\uDFE8";
        }
      } else {
        txt = txt + "\u2B1C";
      }
    });
    txt = txt + "\n";
  });
  return txt;
}

export { genShare };
