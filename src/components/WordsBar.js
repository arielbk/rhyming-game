import React from 'react';
import styled from 'styled-components';

const Words = styled.div`
  width: 80%;
  margin: 2rem auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

const WordsBar = (props) => {
  const { prevWord, currentWord, nextWord } = props;
  return (
    <Words>
      <div>
        <h3>Previous Word:</h3>
        <span>{prevWord}</span>
      </div>
      <div className="current-word">
        <h3>Current Word:</h3>
        <span>{currentWord}</span>
      </div>
      <div>
        <h3>Next Word:</h3>
        <span>{nextWord}</span>
      </div>
    </Words>
  )
}

export default WordsBar;