export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loading-center">
      <div className="spinner" />
      <p>{text}</p>
    </div>
  );
}
