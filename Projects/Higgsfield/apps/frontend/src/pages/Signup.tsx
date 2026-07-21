import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function Signup() {
  return (
    <div className="min-h-screen min-w-screen flex">
      <div className="flex-1 min-h-screen bg-black"></div>

      <div className="flex-1 screen">
        <div className="h-full flex justify-center items-center">
          <Card className="p-5">
            <input placeholder="Username" className="border rounded-2xl p-2" />
            <input placeholder="Password" className="border rounded-2xl p-2" />
            <Button variant={"outline"} className="rounded-2xl">Signup</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
