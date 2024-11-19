import { Link } from "react-router-dom";

function SpotDetailsPage() {
  return (
    <div>
      <h1>Spot details hereeee</h1>
      <p>Some really cool details here.</p>
      <div>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
}

export default SpotDetailsPage;