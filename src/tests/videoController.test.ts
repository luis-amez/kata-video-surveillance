import { VideoController } from '../core/videoController';
import { MotionSensor, VideoRecorder } from '../core/videoInterface';

describe('The video controller', () => {
  it('stops the recording when there is no motion', () => {
    const motionSensor = new StubMotionSensor();
    motionSensor.motion = false;
    const videoRecorder = new SpyVideoRecorder();
    const videoController = new VideoController(motionSensor, videoRecorder);

    videoController.toggleRecording();

    expect(videoRecorder.stoppedRecording).toBeTruthy();
  });

  it('starts the recording when there is motion', () => {
    const motionSensor = new StubMotionSensor();
    motionSensor.motion = true;
    const videoRecorder = new SpyVideoRecorder();
    const videoController = new VideoController(motionSensor, videoRecorder);

    videoController.toggleRecording();

    expect(videoRecorder.startedRecording).toBeTruthy();
  });
});

class StubMotionSensor implements MotionSensor {
  motion = false;

  isDetectingMotion() {
    return this.motion;
  }
}

class SpyVideoRecorder implements VideoRecorder {
  startedRecording = false;
  stoppedRecording = false;

  startRecording() {
    this.startedRecording = true;
  }

  stopRecording() {
    this.stoppedRecording = true;
  }
}
