const Video = ({ media }) => {
  return (
    <div>
      <video ref={media} autoPlay muted></video>
    </div>
  );
};

export default Video;
