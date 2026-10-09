function Wordmark({ size = 64 }) {
  return (
    <span className="wordmark" style={{ fontSize: size }}>
      Budget<em>Buddy</em>
      <span className="wordmark-dot">.</span>
    </span>
  );
}

export default Wordmark;
