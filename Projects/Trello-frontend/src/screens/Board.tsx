import { Appbar } from "../components/Appbar";
import { Card } from "../components/Card";

export function Board() {
  return (
    <div>
      <Appbar />

      <div style={{ display: "flex", padding: 10 }}>
        <div
          style={{
            flex: 1,
            borderRight: "1px dotted black",
            minHeight: "80vh ",
          }}
        >
          <Card
            title="Node to bun migration"
            description="We have been trying this for a while now but it not working out as expected"
          />

          <Card
            title="PBS to temporal migration"
            description="We have been trying this for a while now but it not working out as expected"
          />

          <Card
            title="PHP to FAST API migration"
            description="We have been trying this for a while now but it not working out as expected"
          />
        </div>

        <div
          style={{
            flex: 1,
            borderRight: "1px dotted black",
            minHeight: "80vh ",
          }}
        >
          <Card
            title="Perl to python migration"
            description="We have been trying this for a while now but it not working out as expected"
          />
        </div>

        <div style={{ flex: 1, minHeight: "80vh " }}>
          
        </div>
      </div>
    </div>
  );
}
