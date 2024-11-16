import { Link } from "react-router-dom";

export default function RedirectBox({
  message,
  redirectLink,
  buttonText,
}: {
  message: string;
  redirectLink: string;
  buttonText: string;
}) {
  return (
    <>
      <div className="d-flex flex-column align-items-center mb-3 py-3">
        <h1>{message}</h1>
        <Link to={`${redirectLink}`}>
          <button className="btn btn-success">{buttonText}</button>
        </Link>
      </div>
    </>
  );
}
