import { Link } from "react-router-dom";

const SpotCard = ({ spot }) => {
    return (
      <div>
            <Link to={`/spots/${spot._id}`}>
              <div>
                <img src={spot.images[0]} alt={spot.title} />
                <h2>{spot.title}</h2>
                <p>{spot.location.city}</p>
                <p>{spot.price} €/day</p>
              </div>
            </Link>
      </div>
    );
  };
  
  export default SpotCard;

