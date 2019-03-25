import React from 'react';
import styled from 'styled-components';

const StyledScoreCounter = styled.div`
  h2 {
    display: inline-block;
    padding-right: 1rem;
  }
  span {
    font-size: 2rem;
  }
`;

const ScoreCounter = (props) => (
  <StyledScoreCounter>
    <h2>Score:</h2>
    <span>{props.score}</span>
  </StyledScoreCounter>
);

export default ScoreCounter;