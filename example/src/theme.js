import { createGlobalStyle } from 'styled-components';
import { lighten, darken } from 'polished';

export const COLORS = {};

export function shade (color, step) {
  return step < 0 ? lighten(step * -1 / 10, color) : darken(step / 10, color);
}

export const PADDINGS = {
  TINY: '.4rem',
  XXS: '.8rem',
  XS: '1.6rem',
  S: '2.4rem',
  M: '3.2rem',
  L: '4rem',
  XL: '4.8rem',
  XXL: '5.6rem'
};

export const FONT = {
  WEIGHTS: {},

  FAMILIES: {
    NORMAL: 'Montserrat, Open Sans, Arial, sans-serif',
    MONO: '"Roboto Mono", monospace'
  }
};

export const BORDER_RADIUS = {
  DEFAULT: '.3rem'
};

export function init () {
  return createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900|Roboto+Mono');
    * {
      box-sizing: border-box;
    }
    html {
      font-size: 62.5%;
    }
    body {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      font-size: 1.4rem;
      background: ${COLORS.BACKGROUND};
      font-family: ${FONT.FAMILIES.NORMAL};
      font-weight: 400;
    }
    pre {
      font-family: ${FONT.FAMILIES.MONO};
    }
    button, input, textarea {
      font: inherit;
    }
    #root {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
  `;
}
