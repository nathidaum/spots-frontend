import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h1>Ooooops!</h1>
      <p>Here's nothing exctiting to see.</p>
      <div>
        <Link to="/">Explore spots</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;