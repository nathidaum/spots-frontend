import { Link } from "react-router-dom";
import { Button, Container, Group, Text, Title } from '@mantine/core';
import "./notfoundpage.css"

function NotFoundPage() {
  return (
    <div>
    <Container className="notfoundpage">
      <div className="notfoundlabel">404</div>
      <Title className="notfoundtitle">Oh! You've found a secret spot here.</Title>
      <Text c="dimmed" size="lg" ta="center" className="notfounddescription">
        Let us show you where to find the real spots. 🤙
      </Text>
      <Group justify="center">
        <Button variant="filled" size="md" color="yellow" component={Link}
            to="/">
          Take me to the spots
        </Button>
      </Group>
    </Container>
    </div>
  );
}

export default NotFoundPage;