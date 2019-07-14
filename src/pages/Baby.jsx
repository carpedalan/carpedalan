/* eslint-disable */
import React from 'react';
import { shape } from 'prop-types';
import styled from 'styled-components';

import Dialog from '../components/Dialog';
import Title from '../styles/Title';

const { cdn, assetDomain } = window.__META__; // eslint-disable-line no-underscore-dangle

const FancyTitle = styled(Title)`
  font-family: lobster;
  text-transform: none;
  letter-spacing: 1px;
  font-size: 50px;
  margin-top: 0em;
  margin-bottom: 0.5em;
`;

const CenteredP = styled.p`
  text-align: center;
`;

const Container = styled.div`
  width: 100%;
  img {
    width: 100%;
  }
  margin-bottom: 25px;
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
      <FancyTitle center>Ramsay Carla Dalan</FancyTitle>
      <CenteredP>
        July 9, 2019
        <br />
        11:28PM
      </CenteredP>
      <CenteredP>
        7lbs, 15.7oz
        <br />
        19.75 inches
      </CenteredP>
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <Container>
            <a href={`https://${cdn}/baby/full/ramsay${index + 1}.jpg`}>
              <img
                src={`https://${cdn}/baby/web/ramsay${index + 1}.jpg`}
                alt="ramsy"
              />
            </a>
          </Container>
        ))}
      <CenteredP>
        <a href="https://www.amazon.com/baby-reg/kim-dalan-leif-dalan-july-2019-seattle/3TYD6M2JCXJ0S">
          <img
            width="25%"
            src={`https://${assetDomain}/babyregistry.png`}
            alt="baby registry"
          />
        </a>
      </CenteredP>
    </Dialog>
  );
}

Baby.propTypes = {
  history: shape({}).isRequired,
};
