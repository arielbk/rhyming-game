import React, { Component } from 'react';
import styled from 'styled-components';


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
  input {
    font-size: 2rem;
    margin-right: 2rem;
  }

  .count {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background: #ccc;
    margin: 0 0.3rem;
  }

  .count__active {
    background: #555;
  }
`;

export default class BPMCount extends Component {
  render() {
    const { beat, bpm, changeBPM } = this.props;
    return (
      <BPMCounter>
        <h3>BPM:</h3>
        <input type="number" style={{ display: 'inline-block', margin: 0, padding: 0 }} value={bpm} onChange={changeBPM} />
        <div className={`count ${beat === 1 ? 'count__active' : ''}`} />
        <div className={`count ${beat === 2 ? 'count__active' : ''}`} />
        <div className={`count ${beat === 3 ? 'count__active' : ''}`} />
        <div className={`count ${beat === 4 ? 'count__active' : ''}`} />
      </BPMCounter>
    )
  }
}
