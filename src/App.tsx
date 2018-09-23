import * as React from 'react';
import styled from 'styled-components';
import { ContentGenerator } from './components/ContentGenerator';
import { Scroll } from './components/Scroll';

const Wrapper = styled.div`
  width: 250px;
  margin: 24px auto;
`;
class App extends React.Component {
  public render() {
    return (
      <Wrapper>
        <Scroll>
          <ContentGenerator />
        </Scroll>
      </Wrapper>
    );
  }
}

export default App;
