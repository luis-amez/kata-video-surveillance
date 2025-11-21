import { MotionSensor, VideoRecorder } from './videoInterface';

export class VideoController {
  intervalId: NodeJS.Timeout | undefined;
  readonly lapseInMilliseconds = 1000;

  constructor(
    private motionSensor: MotionSensor,
    private videoRecorder: VideoRecorder
  ) {}

  public start() {
    this.intervalId = setInterval(() => {
      this.toggleRecording();
    }, this.lapseInMilliseconds);
  }

  public stop() {
    clearInterval(this.intervalId);
  }

  public toggleRecording() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      this.motionSensor.isDetectingMotion() ? this.videoRecorder.startRecording() : this.videoRecorder.stopRecording();
    } catch (error) {
      this.videoRecorder.stopRecording();
      console.error(error);
    }
  }
}
