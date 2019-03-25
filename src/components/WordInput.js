import React from 'react';
import styled from 'styled-components';

const StyledWordInput = styled.form`
  text-align: center;
  input {
    padding: 0.5rem;
    margin: 2rem auto;
  }
`;

const WordInput = (props) => {
  const { onSubmit, value, onChange } = props;
  return (
    <StyledWordInput onSubmit={onSubmit}>
      <input value={value} onChange={onChange} />
    </StyledWordInput>
  )
}

export default WordInput;