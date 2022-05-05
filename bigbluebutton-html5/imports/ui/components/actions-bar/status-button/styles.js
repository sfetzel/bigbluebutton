import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';
import Icon from '/imports/ui/components/common/icon/component';
import { colorWhite } from '/imports/ui/stylesheets/styled-components/palette';

const Smiley = styled.div`
    position: fixed;
    visibility: hidden;
    color: ${colorWhite};
    
    right: 1.5em;
    text-align: right;
    width: 100%;
    animation: smiley-animation 3s 1;
  }
  
  @keyframes smiley-animation {
    0% {
      visibility: visible;
      bottom: 10%;
    }
    100% {
      visibility: visible;
      bottom: 30%;
      opacity: 0;
    }
  }`;

const SmileyIcon = styled(Icon)`
  font-size: 2rem;
  margin-left: 0.2em;
`;

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
  SmileyIcon,
};
