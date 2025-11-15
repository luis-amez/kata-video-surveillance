import { VideoController } from '../core/videoController';
import { MotionSensor, VideoRecorder } from '../core/videoInterface';

describe('The video controller', () => {
  it('stops the recording when there is no motion', () => {
    let recordingStopped = false;
    const spyStopRecording = () => (recordingStopped = true);
    const motionSensor = new FakeMotionSensor();
    const videoRecorder = new FakeVideoRecorder();
    videoRecorder.stopRecording = spyStopRecording;
    const videoController = new VideoController(motionSensor, videoRecorder);

    videoController.toggleRecording();

    expect(recordingStopped).toBeTruthy();
  });

  it('starts the recording when there is motion', () => {
    let recordingStarted = false;
    const spyStartRecording = () => (recordingStarted = true);
    const motionSensor = new FakeMotionSensor();
    motionSensor.isDetectingMotion = () => true;
    const videoRecorder = new FakeVideoRecorder();
    videoRecorder.startRecording = spyStartRecording;
    const videoController = new VideoController(motionSensor, videoRecorder);

    videoController.toggleRecording();

    expect(recordingStarted).toBeTruthy();
  });
});

class FakeMotionSensor implements MotionSensor {
  isDetectingMotion() {
    return false;
  }
}

class FakeVideoRecorder implements VideoRecorder {
  startRecording() {
    console.log('Recording started!');
  }

  stopRecording() {
    console.log('Recording stopped!');
  }
}
