import { VideoController } from '../core/videoController';
import { MotionSensor, VideoRecorder } from '../core/videoInterface';

describe('The video controller', () => {
  let motionSensor: FakeMotionSensor;
  let videoRecorder: FakeVideoRecorder;
  let videoController: VideoController;

  beforeEach(() => {
    motionSensor = new FakeMotionSensor();
    videoRecorder = new FakeVideoRecorder();
    videoController = new VideoController(motionSensor, videoRecorder);
  });

  it('stops the recording when there is no motion', () => {
    const stubIsDetectingMotion = jest.spyOn(motionSensor, 'isDetectingMotion');
    stubIsDetectingMotion.mockImplementationOnce(() => false);
    const spyStopRecording = jest.spyOn(videoRecorder, 'stopRecording');

    videoController.toggleRecording();

    expect(spyStopRecording).toHaveBeenCalled();
  });

  it('starts the recording when there is motion', () => {
    const stubIsDetectingMotion = jest.spyOn(motionSensor, 'isDetectingMotion');
    stubIsDetectingMotion.mockImplementationOnce(() => true);
    const spyStartRecording = jest.spyOn(videoRecorder, 'startRecording');

    videoController.toggleRecording();

    expect(spyStartRecording).toHaveBeenCalled();
  });

  it('stops the recording when there is an error with the motion sensor', () => {
    const stubIsDetectingMotion = jest.spyOn(motionSensor, 'isDetectingMotion');
    stubIsDetectingMotion.mockImplementationOnce(() => {
      throw new Error();
    });
    const spyStopRecording = jest.spyOn(videoRecorder, 'stopRecording');

    videoController.toggleRecording();

    expect(spyStopRecording).toHaveBeenCalled();
  });
});

class FakeMotionSensor implements MotionSensor {
  isDetectingMotion(): boolean {
    return false;
  }
}

class FakeVideoRecorder implements VideoRecorder {
  startRecording(): void {}

  stopRecording(): void {}
}
