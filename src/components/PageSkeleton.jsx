import { Skeleton} from "@mantine/core";
import "../pages/explorepage.css"

function PageSkeleton() {
  return (
    <div className="gallery-container">
      <div className="spotslist">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <Skeleton
              height={240}
              radius="lg"
              mb="lg"
              style={{
                width: "100%",
              }}
            />
            <Skeleton
              height={15}
              radius="md"
              mb="sm"
              style={{
                width: "80%",
              }}
            />
            <Skeleton
              height={10}
              radius="md"
              mb="sm"
              style={{
                width: "70%",
              }}
            />
            <Skeleton
              height={10}
              radius="md"
              mb="sm"
              style={{
                width: "20%",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageSkeleton;
