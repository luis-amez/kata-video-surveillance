import { MotionSensor, VideoRecorder } from './videoInterface';

export class VideoController {
  constructor(
    private motionSensor: MotionSensor,
    private videoRecorder: VideoRecorder
  ) {}

  public toggleRecording() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.motionSensor.isDetectingMotion() ? this.videoRecorder.startRecording() : this.videoRecorder.stopRecording();
  }
}
