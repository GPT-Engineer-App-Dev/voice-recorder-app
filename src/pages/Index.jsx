import { useState } from "react";
import { Container, VStack, Text, Button, Box } from "@chakra-ui/react";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [recorder, setRecorder] = useState(null);

  const startRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioURL(audioUrl);
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Voice Recording App</Text>
        <Text>Click the button below to start recording your voice.</Text>
        <Box>
          {isRecording ? (
            <Button colorScheme="red" onClick={stopRecording}>
              Stop Recording
            </Button>
          ) : (
            <Button colorScheme="teal" onClick={startRecording}>
              Start Recording
            </Button>
          )}
        </Box>
        {audioURL && (
          <Box>
            <Text>Here is your recording:</Text>
            <audio controls src={audioURL}></audio>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;