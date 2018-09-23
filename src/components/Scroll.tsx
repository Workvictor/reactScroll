import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 500px;
  width: 100%;
`;

const Viewport = Wrapper.extend`
  height: 100%;
  overflow: hidden;
`;

interface ISnap {
  top: string;
  bottom: string;
}

interface IProps {
  animationDuration: number;
  animationScrollStepMin: number;
  animationScrollStepMax: number;
  scrollStep: number;
  scrollSnap: string;
  children: JSX.Element;
}

interface IState {
  scrollTopTarget: number;
  scrollTop: number;
}

const getDirection = (value: number): number => Math.sign(value);

const getBounds = (delta: number, min: number, max: number): number =>
  Math.min(max, Math.max(delta, min));

export class Scroll extends React.Component<IProps, IState> {
  public static scrollSnap: ISnap = {
    bottom: 'bottom',
    top: 'top',
  };

  public static defaultProps: Partial<IProps> = {
    animationDuration: 1000,
    animationScrollStepMax: 100,
    animationScrollStepMin: 4,
    scrollSnap: Scroll.scrollSnap.top,
    scrollStep: 100,
  };

  public state = {
    scrollTop: 0,
    scrollTopTarget: 0,
  };

  public RAF_ID: number = 0;

  public wrapper: HTMLDivElement;

  public getWrapper = (ref: HTMLDivElement) => {
    this.wrapper = ref;
  }

  public componentDidMount = () => {
    if (this.wrapper) {
      this.setScrollTop(this.wrapper.scrollTop);
    }
  }

  public componentDidUpdate = () => {
    // tslint:disable-next-line
    // console.log('Update', this.state);
    const { scrollTop, scrollTopTarget } = this.state;
    if (this.wrapper) {
      this.wrapper.scrollTop = scrollTop;
    }
    if (scrollTop !== scrollTopTarget) {
      this.RAF_ID = window.requestAnimationFrame(this.animationStep);
    }
    if (scrollTop === scrollTopTarget) {
      this.stopAnimation();
    }
  }

  get trackHeightRelative() {
    if (this.wrapper) {
      const { offsetHeight, scrollHeight } = this.wrapper;
      return offsetHeight / scrollHeight;
    }
    return 0;
  }

  get scrollTopMax() {
    if (this.wrapper) {
      const { offsetHeight, scrollHeight } = this.wrapper;
      return scrollHeight - offsetHeight;
    }
    return 0;
  }

  public getScrollWithBounds = (delta: number): number => {
    return getBounds(delta, 0, this.scrollTopMax);
  }

  public animationStep = () => {
    const { animationScrollStepMax, animationScrollStepMin, animationDuration } = this.props;
    const { scrollTop, scrollTopTarget } = this.state;
    const animationStepRel = 60 / animationDuration;
    const direction = Math.sign(scrollTopTarget - scrollTop);
    const distance = Math.abs(scrollTopTarget - scrollTop);
    const distanceMin = getBounds(distance, 0, animationScrollStepMin);
    const animationStep =
    getBounds(distance * animationStepRel, distanceMin, animationScrollStepMax);
    this.setScrollTop(scrollTop + animationStep * direction);
  }

  public stopAnimation = () => {
    if (this.RAF_ID > 0) {
      window.cancelAnimationFrame(this.RAF_ID);
      this.RAF_ID = 0;
    }
  }

  public startAnimation = () => {
    if (this.RAF_ID === 0) {
      this.RAF_ID = window.requestAnimationFrame(this.animationStep);
    }
  }

  public setScrollTop = (scrollTopNext: number): void => {
    const scrollTopNextBounded = this.getScrollWithBounds(scrollTopNext);
    if (scrollTopNextBounded !== this.state.scrollTop) {
      this.setState({ scrollTop: scrollTopNextBounded });
    }
  }

  public onWheel = (event: React.WheelEvent<HTMLDivElement>): void => {
    const { deltaY } = event;
    const delta = getDirection(deltaY) * this.props.scrollStep + this.state.scrollTopTarget;
    const scrollTopTarget = getBounds(delta, 0, this.scrollTopMax);
    this.setState({ scrollTopTarget });
  }

  public render(): JSX.Element {
    return (
      <Wrapper onWheel={this.onWheel}>
        <Viewport innerRef={this.getWrapper}>
          {this.props.children}
        </Viewport>
      </Wrapper>
    );
  }
}
