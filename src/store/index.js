import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import GlyphSeq from "@/data/GlyphSeq.json";

export default new Vuex.Store({
  state: {
    seq: [],
    seqID: null,
    currentSeq: [],
    guessedSeq: [],
    status: 0,
  },
  getters: {
    allSeqsLength: () => {
      return GlyphSeq.length;
    },
    guessedTimes: (state) => {
      return state.guessedSeq.length;
    },
    seqFinished: (state) => {
      return state.currentSeq.length == 5;
    },
    seqEmpty: (state) => {
      return state.currentSeq.length == 0;
    },
  },
  mutations: {
    reset(state) {
      state.seq = [];
      state.seqID = null;
      state.currentSeq = [];
      state.guessedSeq = [];
      state.status = 0;
    },
    setSeq(state, i) {
      state.seqID = i;
      state.seq = GlyphSeq[state.seqID].map((g) => g.toUpperCase());
      console.log(state.seq);
    },
    randomSeq(state) {
      state.seqID = Math.floor(Math.random() * GlyphSeq.length);
      state.seq = GlyphSeq[state.seqID].map((g) => g.toUpperCase());
      console.log(state.seq);
    },
    delGlyph(state) {
      state.currentSeq.pop();
    },
    addGlyph(state, glyph) {
      if (state.currentSeq.length < 5) state.currentSeq.push(glyph);
    },
    guessGlyph(state) {
      state.status =
        JSON.stringify(state.currentSeq) === JSON.stringify(state.seq) ? 1 : 0;
      state.guessedSeq.push(state.currentSeq);
      if (state.guessedSeq.length > 19 && state.status == 0) {
        state.status = 2;
      }
      state.currentSeq = [];
    },
  },
  actions: {},
  modules: {},
});
