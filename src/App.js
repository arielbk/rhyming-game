import React, { Component } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Typography from 'typography';
import sutroTheme from 'typography-theme-sutro';
import axios from 'axios';
import _ from 'lodash';

import wordsList from './utils/wordsList';
import BPMCounter from './components/BPMCounter';
import WordsBar from './components/WordsBar';
import WordInput from './components/WordInput';
import ScoreCounter from './components/ScoreCounter';

const typography = new Typography(sutroTheme);

const GlobalStyle = createGlobalStyle`
  ${typography.toString()};
`;

const Container = styled.div`
  margin: 0 auto;
  width: 90%;
  max-width: 1020px;
  padding-bottom: 300px;
  h1, h2, h3 {
    margin: 0;
  }
  h2 {
    display: inline-block;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

class App extends Component {
  state = {
    wordInput: '',
    history: [],

    bpm: 60,
    beat: 1,
    metronomeId: null,
    startTime: null,

    prevWord: '',
    currentWord: '',
    nextWord: '',

    rhymes: [],
    score: 0
  };

  componentDidMount = () => {
    this.newWord();
    window.addEventListener('keydown', this.tabForNewWord);
    const metronomeId = setInterval(() => this.nextBeat(), this.state.bpm / 60 * 1000);
    this.setState({ metronomeId });
  }


  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.tabForNewWord)
  }

  nextBeat = () => {
    const { beat } = this.state;
    if (beat < 4) return this.setState({ beat: beat + 1 });
    return this.setState({ beat: 1 });
  }

  tabForNewWord = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      this.newWord();
    };
  }

  newWord = () => {
    const nextWord = _.sample(wordsList);

    let currentWord;
    if (this.state.nextWord && this.state.nextWord !== '') {
      currentWord = this.state.nextWord;
    } else {
      currentWord = _.sample(wordsList);
    }

    axios.get(`https://api.datamuse.com/words?rel_rhy=${currentWord}`)
      .then(fullRhymeRes => {
        const rhymeWords = [];
        fullRhymeRes.data.forEach(rhyme => rhymeWords.push({ type: 'perfect', word: rhyme.word }));

        axios.get(`https://api.datamuse.com/words?rel_nry=${currentWord}`)
          .then(nearRhymeRes => {
            nearRhymeRes.data.forEach(rhyme => rhymeWords.push({ type: 'near', word: rhyme.word }));
          });

        this.setState({ currentWord, nextWord, rhymes: rhymeWords });
      })
      .catch(err => console.error(err));
    this.state.currentWord && this.setState(prevState => ({ prevWord: prevState.currentWord }));
  }

  submitWord = (e) => {
    e.preventDefault();
    const { currentWord, rhymes, wordInput, history } = this.state;
    this.setState({ wordInput: '' });
    if (!currentWord) return;
    const isFound = rhymes.find(rhyme => rhyme.word === wordInput.toLowerCase())
    if (isFound) {
      if (history.includes(wordInput)) return;
      this.setState(prevState => ({ score: prevState.score + 1, history: [wordInput, ...prevState.history] }));
    }
  }

  changeBPM = ({ target }) => {
    clearInterval(this.state.metronomeId);
    const metronomeId = setInterval(() => this.nextBeat(), 60 / target.value * 1000);
    this.setState({ bpm: target.value, metronomeId });
  };

  inputChange = ({ target }) => this.setState({ wordInput: target.value });

  render() {
    const { beat, prevWord, currentWord, nextWord, wordInput, score } = this.state;

    return (
      <ThemeProvider theme={{}}>
        <Container>
          <GlobalStyle />
          <Header>
            <div>
              <h1>Rhyming Game</h1>
            </div>
            <ScoreCounter score={score} />
          </Header>
          <WordsBar prevWord={prevWord} currentWord={currentWord} nextWord={nextWord} />
          <WordInput onSubmit={this.submitWord} value={wordInput} onChange={this.inputChange} />
          <BPMCounter beat={beat} bpm={this.state.bpm} changeBPM={this.changeBPM} />
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
