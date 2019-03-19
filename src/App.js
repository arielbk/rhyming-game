import React, { Component } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Typography from 'typography';
import sutroTheme from 'typography-theme-sutro';
import axios from 'axios';

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
  form {
    text-align: center;
  }
  input {
    padding: 0.5rem;
    margin: 2rem auto;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

const ScoreCounter = styled.div`
  h2 {
    margin-right: 2rem;
  }
  span {
    font-size: 2rem;
  }
`;

const Words = styled.div`
  width: 80%;
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  div {
    text-align: center;
    transform: scale(0.6);
    opacity: 0.8;
  }
  .current-word {
    transform: scale(1);
    opacity: 1;
  }
`;

const BPMCounter = styled.div`
  border: 1px solid gray;
  background: white;
  width: 100%;
  height: 100px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  h3 {
    margin-right: 2rem;
  }
  span {
    font-size: 2rem;
  }
`;

class App extends Component {
  state = {
    input: '',
    history: [],
    bpm: 60,

    prevWord: '',
    currentWord: '',
    nextWord: '',

    rhymes: [],
    score: 0
  };

  componentDidMount = () => {
    this.newWord();
    window.addEventListener('keydown', this.tabForNewWord);
  }


  componentWillUnmount = () => {
    window.removeEventListener('keydown', this.tabForNewWord)
  }

  tabForNewWord = (e) => {
    if (e.keyCode === 9) {
      e.preventDefault();
      this.newWord();
    };
  }

  newWord = () => {
    // this should be some kind of fetched list - just for testing
    const words = ['egg', 'apple', 'word', 'window', 'cloth', 'towel'];

    const randIndex = () => Math.floor(Math.random() * words.length);
    const nextWord = words[randIndex()];

    let currentWord;
    if (this.state.nextWord && this.state.nextWord !== '') {
      currentWord = this.state.nextWord;
    } else {
      currentWord = words[randIndex()];
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
    const { currentWord, rhymes, input, history } = this.state;
    this.setState({ input: '' });
    if (!currentWord) return;
    const isFound = rhymes.find(rhyme => rhyme.word === input.toLowerCase())
    if (isFound) {
      if (history.includes(input)) return;
      this.setState(prevState => ({ score: prevState.score + 1, history: [input, ...prevState.history] }));
    }
  }

  render() {
    return (
      <ThemeProvider theme={{}}>
        <Container>
          <GlobalStyle />
          <Header>
            <div>
              <h1>Rhyming Game</h1>
            </div>
            <ScoreCounter>
              <h2>Score:</h2>
              <span>{this.state.score}</span>
            </ScoreCounter>
          </Header>
          <Words>
            <div>
              <h3>Previous Word:</h3>
              <span>{this.state.prevWord}</span>
            </div>
            <div className="current-word">
              <h3>Current Word:</h3>
              <span>{this.state.currentWord}</span>
            </div>
            <div>
              <h3>Next Word:</h3>
              <span>{this.state.nextWord}</span>
            </div>
          </Words>
          <form onSubmit={this.submitWord}>
            <input value={this.state.input} onChange={({ target }) => this.setState({ input: target.value })} />
          </form>
          <BPMCounter><h3>BPM:</h3> <span>{this.state.bpm}</span></BPMCounter>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
