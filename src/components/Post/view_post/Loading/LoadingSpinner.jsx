import "./LoadingPage.css";
export default function LoadingSpinner() {
  return (
    <div className="LoadingPage">
      <div
        className="spinner-border"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
