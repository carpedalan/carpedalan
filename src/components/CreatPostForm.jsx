import React, { useContext, useEffect, useRef, useState } from 'react';
import { func, number, shape, string } from 'prop-types';
import styled, { css } from 'styled-components';

import InputField from '../fields/InputField';
import Drowpdown from '../fields/Dropdown';
import { Posts } from '../providers/PostsProvider';
import { Tag } from '../providers/TagProvider';
import { prop, propTrueFalse } from '../styles';
import Flex from '../styles/FlexContainer';
import Title from '../styles/Title';

import PreviewImage from './PreviewImage';
import Success from './Success';

const Img = styled.div`
  position: relative;
  ${props =>
    props.orientation === 'portrait'
      ? css`
          padding-top: 100%;
          position: relative;
          > div {
            position: absolute;
            top: 0;
            left: 0;
            transform-origin: 37.5%;
            transform: rotate(90deg);
          }
        `
      : null}
  :after {
    position: absolute;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    content: '';
    bottom: 0;
    left: 0;
    height: ${prop('progress')}%;
    transition: height ${prop('animationTime')}ms linear;
  }
`;

Img.defaultProps = {
  progress: 0,
  animationTime: 3000,
};

const Message = styled(Flex)`
  position: absolute;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  content: '';
  bottom: 0;
  left: 0;
  height: 100%;
  transition: height ${prop('animationTime')}ms linear;
`;

const Wrapper = styled(Flex)`
  ${propTrueFalse(
    'showHalo',
    css`
      padding: 5px;
      background: rgba(255, 255, 255, 0.6);
      box-shadow: rgba(255, 255, 255, 0.6) 0px 0px 10px 10px;
    `,
    null,
  )}
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 40%;
`;

const Container = styled.div`
  position: relative;
`;

const CreatePost = ({
  preview,
  index,
  savingState,
  onChange,
  processingTime,
}) => {
  const { tags } = useContext(Tag);
  const { progressMap } = useContext(Posts);
  const [description, setDescription] = useState('');
  const [tagInput, setTags] = useState([]);
  const ref = useRef();

  const aggregateProgress = ['fulfilled', 'rejected'].includes(
    savingState.state,
  )
    ? 100
    : progressMap[index];

  useEffect(() => {
    onChange({ tags: tagInput.map(({ value }) => value), description }, index);
  }, [tagInput, description, ref]);

  return (
    <>
      <>
        {preview ? (
          <Container>
            <Img
              orientation={preview.orientation}
              progress={aggregateProgress}
              animationTime={processingTime}
            >
              <PreviewImage
                alt="preview"
                width="100%"
                src={preview.url}
                placeholderColor="white"
                shouldShowImage
                ratio={preview.height / preview.width}
              />
            </Img>
            <Message>
              <Wrapper showHalo={savingState.state !== 'fulfilled'}>
                <Title>
                  {savingState.state === 'queued' ? 'Queued' : null}

                  {savingState.state === 'rejected' ? `Failed` : null}
                  {savingState.state === 'fulfilled' ? <Success /> : null}

                  {savingState.state === 'pending' ? `Submitting` : null}
                </Title>
                {savingState.state === 'rejected' ? (
                  <div>
                    <div>{savingState.value}</div>
                    <div>{savingState.meta.file.name}</div>
                    <div>{`File number ${savingState.meta.index + 1}`}</div>
                  </div>
                ) : null}
              </Wrapper>
            </Message>
          </Container>
        ) : null}
        <InputField
          name="description"
          placeholder="Description"
          input={{
            onChange: setDescription,
            value: description,
          }}
        />
        <Drowpdown
          name="tags"
          options={tags.map(tag => ({
            value: tag.id,
            label: tag.name,
          }))}
          isMulti
          placeholder="Type or click for tags"
          input={{
            onChange: setTags,
            value: tagInput,
          }}
        />
        <div />
      </>
    </>
  );
};

CreatePost.defaultProps = {
  preview: null,
  savingState: {},
};

CreatePost.propTypes = {
  preview: shape({
    url: string.isRequired,
    width: number.isRequired,
    height: number.isRequired,
  }),
  index: number.isRequired,
  savingState: shape({
    state: string.isRequired,
    value: shape({ id: string.isRequired }),
  }),
  onChange: func.isRequired,
  processingTime: number.isRequired,
};
export default CreatePost;
