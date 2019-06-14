import React from 'react';
import { shape } from 'prop-types';
import styled from 'styled-components';

import Dialog from '../components/Dialog';
import Title from '../styles/Title';

const FancyTitle = styled(Title)`
  font-family: lobster;
  text-transform: none;
  letter-spacing: 1px;
  font-size: 50px;
  margin-top: 0em;
  margin-bottom: 0.5em;
`;

// const Signature = styled.span`
//   font-family: lobster;
// `;

// const StyledTitle = styled(Title)`
//   margin-bottom: 0;
// `;

export default function Baby({ history }) {
  return (
    <Dialog onClose={() => history.push('/')} type="copy">
      {/* eslint-disable react/jsx-one-expression-per-line */}
      <FancyTitle center>Maryn Carla Dalan</FancyTitle>
      <p>things</p>
    </Dialog>
  );
}

Baby.propTypes = {
  history: shape({}).isRequired,
};
