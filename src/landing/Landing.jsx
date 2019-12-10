import React, {useState, useMemo} from 'react';
import VerticalLayout from '../components/core/layout/VerticalLayout.react';
import Card from '../components/core/UI/Card.react';
import Text from '../components/core/UI/Text.react';
import withDragAndDrop from '../components/hoc/withDragAndDrop.react';
import Button from '../components/core/UI/Button.react';
import Quiz from '../quiz/Quiz.react';
import Spinner from '../components/core/UI/Spinner.react';
import {randomizeArray} from '../service/util/util';

const Landing = () => {
  const [isLoading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);

  const handleDrop = async e => {
    if (e.dataTransfer.items) {
      setLoading(true);
      const file = e.dataTransfer.items[0];
      if (file.kind === 'file' && file.type === 'application/json') {
        const fileContents = await file.getAsFile().text();
        const fileData = JSON.parse(fileContents);
        // Error handling should go here
        setQuizData(randomizeArray(fileData));
      }
      setLoading(false);
    }
  };

  const handleUpload = async e => {
    if (e.target.files) {
      setLoading(true);
      const file = e.target.files[0];
      if (file.type === 'application/json') {
        const fileContents = await file.text();
        const fileData = JSON.parse(fileContents);
        // Error handling should go here
        setQuizData(fileData);
      }
      setLoading(false);
    }
  };
  const DragAndDropCard = useMemo(() => withDragAndDrop(Card, handleDrop), []);
  const quizEndHandler = () => setQuizData(null);

  return (
    <VerticalLayout center="middle">
      {!quizData ? (
        <>
          <Text type="header1">JSON Flashcards</Text>
          <Text type="body1">
            Create flashcards quickly from a formatted .json file.
          </Text>
          <DragAndDropCard enabled={!isLoading}>
            {!isLoading ? (
              <VerticalLayout center="middle">
                <Text type="header2" align="center">
                  Drag and drop your .json file here
                </Text>
                <Text type="body1">or</Text>
                <Button
                  id="fileUpload"
                  type="file"
                  value="Upload"
                  onChange={handleUpload}
                ></Button>
              </VerticalLayout>
            ) : (
              <Spinner text="Loading your cards..." />
            )}
          </DragAndDropCard>
          <Text type="body1">
            <Button type="link" value="How do I format my .json?" />
          </Text>
        </>
      ) : (
        <>
          {!isLoading && <Quiz data={quizData} finishQuiz={quizEndHandler} />}
        </>
      )}
    </VerticalLayout>
  );
};

export default Landing;
