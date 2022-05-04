import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';
import { colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

const Smiley = styled.div`
    position: absolute;
    visibility: hidden;
    color: ${colorWhite};
    
    left: 0px;
    top: 0px;
    font-size: 2rem;
    animation: smiley-animation 3s 1;
  }
  
  @keyframes smiley-animation {
    0% {
      position: relative;
      visibility: visible;
      top: -1.5em;
    }
    100% {
      position: relative;
      visibility: visible;
      top: -5em;
      opacity: 0;
    }
  }`;

const EmojiStatusButton = styled(Button)`
  ${({ emoji }) => emoji !== 'raiseHand' && `
      span {
        box-shadow: none;
        background-color: transparent !important;
        border-color: ${colorWhite} !important;
      }
   `}
`;

export default {
  Smiley,
  EmojiStatusButton,
};
