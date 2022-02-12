function genShare(guessedSeq, seq, seqID) {
  let txt = `Glyphdle (#${seqID}) ${guessedSeq.length}/20\n\n`;
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
  txt = txt + `\nhttps://glyphdle.0x7f.cc/#${seqID}`;
  return txt;
}

export { genShare };
