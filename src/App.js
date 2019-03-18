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
`;

const Words = styled.div`
  width: 80%;
  margin: 0 auto;
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

const NewWord = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #777;
  cursor: pointer;
  margin: 2rem auto;
`;

class App extends Component {
  state = {
    input: '',
    history: [],

    prevWord: '',
    currentWord: '',
    nextWord: '',

    rhymes: [],
    score: 0
  };

  componentDidMount = () => {
    this.newWord();
    window.addEventListener('keydown', (e) => {
      if (e.keyCode === 9) {
        e.preventDefault();
        this.newWord();
      };
    });
  }

  newWord = () => {
    // this should be some kind of fetched list - this is for testing
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
      .then(res => {
        const rhymeWords = [];
        res.data.forEach(rhyme => rhymeWords.push(rhyme.word));
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
    if (rhymes.includes(input.toLowerCase())) {
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
              <p>See how many words you can rhyme!</p>
            </div>
            <div>
              <h2>Score</h2>
              <span>{this.state.score}</span>
            </div>
          </Header>
          <NewWord onClick={this.newWord}>New Word (or press <code>Tab</code>)</NewWord>
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
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
