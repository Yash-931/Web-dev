import { Button } from "./Button";
import { Center } from "./Center";
import { Input } from "./Input";

export function AuthCredentials() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div style={{ width: "100%" }}>
        <Center>
          <div style={{ fontSize: "30px" }}>Log in to Trello</div>
        </Center>

        <Center>Connect to trello with:</Center>

        <Center>
          <Input type="text" placeholder="Email" />
        </Center>

        <Center>
          <Input placeholder="Password" />
        </Center>

        <Center>
          <Button>Log in</Button>
        </Center>
      </div>
    </div>
  );
}
