import React, { Timeout } from 'react';

const Placeholder = ({ delayMs, fallback, children }) => {
  return (
    <Timeout ms={delayMs}>
      {(didTimeout) => (didTimeout ? fallback : children)}
    </Timeout>
  );
};

export default Placeholder;
