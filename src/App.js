import React, { Component } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import Typography from 'typography';
import sutroTheme from 'typography-theme-sutro';
import axios from 'axios';

const typography = new Typography(sutroTheme);

const GlobalStyle = createGlobalStyle`
  ${typography.toString()};
  body {
    text-align: center;
  }
`;

const Container = styled.div`
  padding: 2rem;
  h2 {
    display: inline-block;
    padding: 0 2rem;
  }
  input {
    padding: 0.5rem;
  }
`;

const NewWord = styled.div`
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #777;
  cursor: pointer;
`;

class App extends Component {
  state = {
    input: '',
    history: [],

    word: '',
    rhymes: [],
    score: 0
  };

  componentDidMount = () => {
    this.newWord();
  }

  newWord = () => {
    const words = ['egg', 'apple', 'word', 'window', 'cloth', 'towel'];
    const randIndex = Math.floor(Math.random() * words.length);
    const word = words[randIndex];

    axios.get(`https://api.datamuse.com/words?rel_rhy=${word}`)
      .then(res => {
        const rhymeWords = [];
        res.data.forEach(rhyme => rhymeWords.push(rhyme.word));
        this.setState({ word, rhymes: rhymeWords });
      })
      .catch(err => console.error(err));
  }

  submitWord = (e) => {
    e.preventDefault();
    const { word, rhymes, input, history } = this.state;
    this.setState({ input: '' });
    if (!word) return;
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
          <div>
            <h1>Rhyming Game</h1>
            <p>See how many words you can rhyme!</p>
          </div>
          <NewWord onClick={this.newWord}>New Word</NewWord>
          <div>
            <h2>Current Word:</h2>
            <span>{this.state.word}</span>
          </div>
          <form onSubmit={this.submitWord}>
            <input value={this.state.input} onChange={({ target }) => this.setState({ input: target.value })} />
          </form>
          <h2>Score</h2>
          <span>{this.state.score}</span>
        </Container>
      </ThemeProvider>
    );
  }
}

export default App;
