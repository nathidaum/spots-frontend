import { Container, Skeleton} from "@mantine/core";

function PageSkeleton() {
    return (
        <div>
        {Array.from({ length: 4 }).map((_, index) => (
            <Container key={index} px={0} style={{ margin: 0 }}>
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
            </Container>
          ))}
          </div>
    )
}

export default PageSkeleton;