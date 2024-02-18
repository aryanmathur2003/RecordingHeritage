import React, { useRef, useState } from 'react';
import { Card } from 'antd';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const RecordPage = () => {

    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioURL, setAudioURL] = useState('');
    const [transcriptFinal, setTranscript] = useState();
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);
    const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    const {transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return null
    }

    

    const startRecording = () => {
        startListening()
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const recorder = new MediaRecorder(stream);
                recorder.start();
                recorder.ondataavailable = async (e) => {
                    const audioData = new Blob([e.data], { type: 'audio/webm' });
                    const audioUrl = URL.createObjectURL(audioData);
                    setAudioURL(audioUrl);
                    setTranscript(transcript);
                };

                setMediaRecorder(recorder);
                setRecording(true);
            });
    };

    const stopRecording = () => {
        SpeechRecognition.stopListening()
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecording(false);
        }
    };

    const handlePlayPause = () => {
        const audio = audioRef.current;
        if (audio) {
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col items-center justify-center">
            <header className="text-center p-8">
                <h3 className="text-5xl font-bold text-slate-900 mb-4">Share stories about your culture.</h3>
                <button
                    onClick={recording ? stopRecording : startRecording}
                    className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-primary-600 border border-transparent rounded-lg active:bg-primary-600 hover:bg-primary-700 focus:outline-none focus:shadow-outline-primary dark:text-gray-900 dark:bg-gray-50 dark:border-gray-300 dark:hover:bg-gray-200"
                >
                    {recording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </header>
            <section className="flex justify-center items-center p-8">
                <Card className="w-[700px] bg-slate-200">
                    <div className="p-4">
                        <h2 className="font-bold text-lg mb-2">"What are some unique cultural traditions or customs that are important to you or your community?"...</h2>
                        <p className="text-sm">Question 1/10</p>
                        <p className="text-xs">Interviewing now...</p>
                    </div>
                </Card>
            </section>

            <section className="flex justify-center items-center p-8">
                <div className="w-full max-w-3xl bg-slate-200 p-4 rounded-lg shadow">
                    {audioURL && (
                        <div className="flex items-center justify-between mb-4">
                            <PlayIcon className="h-6 w-6 text-slate-900" onClick={handlePlayPause} />
                            <audio ref={audioRef} controls src={audioURL} className="h-6 w-6 text-slate-900" />
                            <div className="flex-1 mx-4">
                                <div className="w-full bg-gray-300 rounded-full h-1.5">
                                    <div
                                        className="bg-slate-900 h-1.5 rounded-full"
                                        style={{
                                            width: "30%",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <div className='h-fit w-1/2 rounded-lg m-8 p-6 bg-gray-200'>
                <a className='text-lg w-full mx-auto m-2'>Output:    </a>
                {transcript}
            </div>
        </div>
    );
};

const PlayIcon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);

export default RecordPage;
