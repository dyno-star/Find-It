
window.AppComponents = window.AppComponents || {};

window.AppComponents.CameraCapture = ({ onCapture }) => {
    const videoRef = React.useRef(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(err => setError("Please allow camera access to capture items"));

        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current) return;
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        onCapture(canvas.toDataURL('image/jpeg'));
    };

    return (
        <div className="relative">
            {error && <p className="text-red-600 text-center mb-2">{error}</p>}
            <video ref={videoRef} autoPlay className="w-full max-w-md rounded-xl shadow-2xl border-4 border-white" />
            <button 
                onClick={capturePhoto}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 px-6 py-2 rounded-full shadow-lg hover:bg-blue-100 transition-all duration-300"
            >
                Capture
            </button>
        </div>
    );
};