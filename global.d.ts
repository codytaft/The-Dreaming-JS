declare module Houndify {
  class AudioRecorder {
    stop(): any;
    isRecording(): any;
    start(): any;
    sampleRate: number;
    on(event: string, action: (data: any) => void): void;
  }

  class VoiceRequest {
    constructor(options: any);
    write: (arg0: any) => void;
    end: () => void;
    abort: () => void;
  }
}

declare var zingchart: {
    render: (data: {
        id: string,
        data: {
            type: string,
            options: {
                words: any
            }
        },
        width: number | string,
        height: number | string
    }) => void;
};

declare class Dream {
    date: string;
    dream: string;
    user_id: string;
    dream_id: string;
}