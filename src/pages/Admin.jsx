import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import exifReader from 'exifreader';
import styled, { css } from 'styled-components';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';

import CreatPostForm from '../components/CreatPostForm';
import Modal from '../components/Modal';
import { Posts } from '../providers/PostsProvider';
import { BRAND_COLOR, getThemeValue, prop, propTrueFalse } from '../styles';
import Button from '../styles/Button';
import FlexContainer from '../styles/FlexContainer';
import Title from '../styles/Title';
import Wrapper from '../styles/Wrapper';
import { performance, setInterval, clearInterval } from '../utils/globals';

const Input = styled.input`
  display: none;
`;

const Flex = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  background: ${getThemeValue(BRAND_COLOR)};
`;

const StyledButton = styled(Button)`
  position: fixed;
  bottom: 2em;
  ${propTrueFalse('left', 'left', 'right')}: 2em;
  width: ${propTrueFalse('submitting', 'calc(100% - 4em)', '200px')};
  transition: width 500ms ease-in-out, background-color 500ms ease-in;
  overflow: hidden;
  ${propTrueFalse(
    'submitting',
    css`
      position: 
      background-color: green;
      :after {
      transition: width ${prop(
        'averageTime',
      )}ms ease-in-out, background-color 500ms linear;
        position: absolute;
        top: 0;
        left: 0
        height: 100%;
        width: ${prop('progress')}%
        background-color: rgba(0,0,0,.5);
        content: ''
      }
    `,
    null,
  )}
`;

const Report = styled.div`
  width: 50vw;
  max-height: 90vw;
  overflow: scroll;
  background: white;
  padding: 2em;
  border-radius: 5em;
`;

const HR = styled.hr`
  margin: 3em 0;
`;

const Admin = () => {
  const { createPost } = useContext(Posts);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [savingState, setSavingState] = useState({});
  const [submit, setSubmitAll] = useState(false);
  const [formMap, setFormMap] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [clockValue, setClockValue] = useState(null);
  const [averageTime, setAverageTime] = useState(3000);
  const [processingTime, setProcessTime] = useState(3000);
  const [showReport, setShowReport] = useState(false);

  const fileInputRef = useRef();

  const submitAll = async () => {
    let hasFailure = false;
    let innerSavingState = { ...savingState };
    const executionTimes = [];
    await Object.keys(formMap).reduce(async (promiseChain, index) => {
      let chainedResponses = [];
      let fileValue;
      try {
        chainedResponses = await promiseChain;
        innerSavingState = {
          ...innerSavingState,
          [index]: {
            state: 'pending',
          },
        };
        const timeStart = performance.now();
        fileValue = fileInputRef.current.files[index];

        const formData = new FormData();
        Object.keys(formMap[index]).forEach(key =>
          formData.append(key, formMap[index][key]),
        );
        if (formMap[index].description === 'fail') throw Error('failure');
        formData.append('photo', fileValue);
        setSavingState(innerSavingState);
        const { processTime, response } = await createPost(formData, index);
        setProcessTime(processTime);

        const timeEnd = performance.now();
        const milliseconds = timeEnd - timeStart;
        executionTimes.push(milliseconds);

        const average =
          executionTimes.reduce((acc, time) => acc + time, 0) /
          executionTimes.length;

        setAverageTime(average);
        const total = Object.keys(formMap).length;
        const remaining = total - index - 1;

        setTimeRemaining(average * remaining);
        innerSavingState = {
          ...innerSavingState,
          [index]: {
            state: 'fulfilled',
            value: response,
          },
        };
        return [...chainedResponses, response];
      } catch (e) {
        hasFailure = true;
        innerSavingState = {
          ...innerSavingState,
          [index]: {
            state: 'rejected',
            value: `${e.name}: ${e.message}`,
            meta: {
              file: fileValue,
              index,
            },
          },
        };
        return [...chainedResponses, e];
      } finally {
        setSavingState(innerSavingState);
      }
    }, Promise.resolve([]));
    setSubmitAll(false);
    if (hasFailure) setShowReport(true);
  };

  useEffect(() => {
    let innerTime = timeRemaining;
    let interval;
    if (timeRemaining) {
      interval = setInterval(() => {
        setClockValue(innerTime);
        innerTime -= 1000;
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeRemaining]);

  useEffect(() => {
    if (submit) submitAll();
    return null;
  }, [submit]);

  useEffect(() => {
    // Initialize our form object for each preview file, otherwise
    // we'd have to wait for the user to touch the form for it to
    // be regestired.
    const newForms = Array.from(files).reduce(
      (acc, _, index) => ({
        ...acc,
        [index]: {
          tag: [],
          description: '',
        },
      }),
      {},
    );
    setFormMap(newForms);
    const initialSavingState = Array.from(files).reduce(
      (acc, _, index) => ({
        ...acc,
        [index]: {
          state: 'queued',
        },
      }),
      {},
    );
    setSavingState(initialSavingState);
  }, [files]);

  const handleChange = async e => {
    setFiles(e.target.files);

    const newPreviewsPromises = Array.from(e.target.files).map(
      file =>
        new Promise(resolve => {
          const reader = new FileReader();
          const url = URL.createObjectURL(file);
          reader.onload = function() {
            try {
              const arrayBuffer = this.result;
              const data = exifReader.load(arrayBuffer);
              const orientation =
                data.Orientation.value === 6 ? 'portrait' : 'landscape';

              const exifData = Object.keys(data).reduce(
                (acc, key) => ({
                  ...acc,
                  [camelCase(key)]: data[key].value,
                }),
                {},
              );

              resolve({
                url,
                orientation,
                height: data.ImageLength.value,
                width: data.ImageWidth.value,
                exifData: omit(exifData, 'makerNote'),
              });
            } catch (er) {
              resolve({ url, orientation: 'landscape' });
            }
          };
          reader.readAsArrayBuffer(file);
        }),
    );
    const newPreviews = await Promise.all(newPreviewsPromises);
    setPreviews(newPreviews);
  };

  const handleFormChange = (values, index) => {
    setFormMap({ ...formMap, [index]: values });
  };

  const { rejected, succeeded, queued } = Object.keys(savingState).reduce(
    (acc, key) => ({
      succeeded:
        savingState[key].state === 'fulfilled'
          ? [...acc.succeeded, savingState[key]]
          : acc.succeeded,
      rejected:
        savingState[key].state === 'rejected'
          ? [...acc.rejected, savingState[key]]
          : acc.rejected,
      queued:
        savingState[key].state === 'queued'
          ? [...acc.queued, savingState[key]]
          : acc.queued,
    }),
    {
      rejected: [],
      succeeded: [],
      queued: [],
    },
  );

  const overall = Math.floor(
    ((rejected.length + succeeded.length) / Object.keys(savingState).length) *
      100,
  );

  const formatClockValue = () => {
    if (!clockValue) return '?';
    const minutes = Math.floor(clockValue / 1000 / 60);
    const seconds = (clockValue / 1000 / 60 - minutes) * 60;
    return `${minutes}m ${Math.floor(seconds)}s`;
  };

  return (
    <>
      <Input
        id="multiUploader"
        data-test="multiUploader"
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleChange}
      />

      {!files.length ? (
        <Flex as="label" htmlFor="multiUploader">
          <Title>Click to Upload</Title>
        </Flex>
      ) : (
        <Wrapper>
          {Array.from(files).map((file, index) => (
            <Fragment key={file.name}>
              <CreatPostForm
                key={file.name}
                index={index}
                fileInputRef={fileInputRef}
                preview={previews[index]}
                savingState={savingState[index]}
                onChange={handleFormChange}
                processingTime={processingTime}
              />
              <HR />
            </Fragment>
          ))}
          <StyledButton
            type="button"
            data-test="submitAll"
            onClick={e => {
              e.preventDefault();
              setSubmitAll(true);
            }}
            submitting={submit}
            progress={overall + 100 / Object.keys(savingState).length}
            averageTime={averageTime}
          >
            {/* eslint-disable */}
            {submit ? (
              <>
                <div>{`Overall: ${overall}%`}</div>
                <div>{`Queued: ${queued.length}`}</div>
                <div>{`Succeeded: ${succeeded.length}`}</div>
                <div>{`Rejected: ${rejected.length}`}</div>
                <div>{`Time Remaining: ${formatClockValue()}`}</div>
              </>
            ) : overall === 100 ? (
              `Submitted ${succeeded.length} ${
                rejected ? `${rejected.length} failed` : ''
              }`
            ) : (
              'Submit All'
            )}
            {/* eslint-enable */}
          </StyledButton>
          {overall === 100 ? (
            <StyledButton
              type="danger"
              left
              onClick={() => setShowReport(true)}
            >
              Show report
            </StyledButton>
          ) : null}
          {showReport ? (
            <>
              <Modal>
                <Report onClick={() => setShowReport(false)}>
                  <div>Rejected</div>
                  <ul>
                    {rejected.map(reject => (
                      <li>{reject.meta.file.name}</li>
                    ))}
                  </ul>
                </Report>
              </Modal>
            </>
          ) : null}
        </Wrapper>
      )}
    </>
  );
};

export default Admin;
