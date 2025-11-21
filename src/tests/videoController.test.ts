import { VideoController } from '../core/videoController';
import { MotionSensor, VideoRecorder } from '../core/videoInterface';

describe('The video controller', () => {
  const secondsInMillis = 1000;
  let motionSensor: FakeMotionSensor;
  let videoRecorder: FakeVideoRecorder;
  let videoController: VideoController;
  let stubIsDetectingMotion: jest.SpyInstance<boolean, []>;
  let spyToggleRecording: jest.SpyInstance<void, []>;

  beforeEach(() => {
    motionSensor = new FakeMotionSensor();
    videoRecorder = new FakeVideoRecorder();
    videoController = new VideoController(motionSensor, videoRecorder);
    stubIsDetectingMotion = jest.spyOn(motionSensor, 'isDetectingMotion');
    spyToggleRecording = jest.spyOn(videoController, 'toggleRecording');
  });

  it('stops the recording when there is no motion', () => {
    stubIsDetectingMotion.mockImplementationOnce(() => false);
    const spyStopRecording = jest.spyOn(videoRecorder, 'stopRecording');

    videoController.toggleRecording();

    expect(spyStopRecording).toHaveBeenCalled();
  });

  it('starts the recording when there is motion', () => {
    stubIsDetectingMotion.mockImplementationOnce(() => true);
    const spyStartRecording = jest.spyOn(videoRecorder, 'startRecording');

    videoController.toggleRecording();

    expect(spyStartRecording).toHaveBeenCalled();
  });

  it('stops the recording when there is an error with the motion sensor', () => {
    stubIsDetectingMotion.mockImplementationOnce(() => {
      throw new Error();
    });
    const spyStopRecording = jest.spyOn(videoRecorder, 'stopRecording');

    videoController.toggleRecording();

    expect(spyStopRecording).toHaveBeenCalled();
  });

  it('checks the motion sensor once during 1 second', () => {
    jest.useFakeTimers();
    const timeOnInSeconds = 1;
    stubIsDetectingMotion.mockImplementationOnce(() => true);

    videoController.start();
    jest.advanceTimersByTime(timeOnInSeconds * secondsInMillis);

    expect(spyToggleRecording).toHaveBeenCalledTimes(timeOnInSeconds);
  });

  it('checks the motion sensor once per second during several seconds', () => {
    jest.useFakeTimers();
    const timeOnInSeconds = 5;
    stubIsDetectingMotion.mockImplementationOnce(() => true);

    videoController.start();
    jest.advanceTimersByTime(timeOnInSeconds * secondsInMillis);

    expect(spyToggleRecording).toHaveBeenCalledTimes(timeOnInSeconds);
  });

  it('stops checking the motion sensor once the controller is stopped', () => {
    jest.useFakeTimers();
    const timeOnInSeconds = 3;
    const timeOffInSeconds = 4;
    stubIsDetectingMotion.mockImplementationOnce(() => true);
    videoController.start();
    jest.advanceTimersByTime(timeOnInSeconds * secondsInMillis);
    expect(spyToggleRecording).toHaveBeenCalledTimes(timeOnInSeconds);
    spyToggleRecording.mockClear();

    videoController.stop();
    jest.advanceTimersByTime(timeOffInSeconds * secondsInMillis);

    expect(spyToggleRecording).not.toHaveBeenCalled();
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
