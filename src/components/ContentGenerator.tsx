import * as React from 'react';
import styled from 'styled-components';

const Block = styled.div`
  font-size: 24px;
  padding: 8px;
  width: 150px;
  margin: 0 auto;
  text-align: center;
  border-bottom: 1px solid #777;
  cursor: pointer;
  &:hover{
    box-shadow: 0 3px 5px hsla(0, 0%, 0%, 0.1);
  }
`;

interface IState {
  contentArray: number[];
}

export class ContentGenerator extends React.Component<{}, IState> {
  public state: IState = {
    contentArray: [],
  };

  public componentDidMount = () => {
    const contentArray = [];
    for (let i: number = 0; i < 50; i += 1) {
      contentArray.push(i);
    }
    this.setState({ contentArray });
  }

  public render() {
    return (
      <div>
        {this.state.contentArray.map(val => <Block key={val}>{val}</Block>)}
      </div>
    );
  }
}
