export default function Loading() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status">
        <embed src="https://template.canva.com/EAFZoV7nVJk/1/document_2560w-9IvKwHfzyVs.mp4"></embed>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}