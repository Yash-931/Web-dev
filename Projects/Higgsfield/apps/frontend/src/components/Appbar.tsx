import { useNavigate } from "react-router";
import { Button } from "./ui/button";

export function Appbar() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between bg-black text-white">
        <div className="p-4 text-xl">Higgsfield</div>
        <div className="flex items-center justify-center space-x-2">
          <div>
            <Button
              variant={"outline"}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </Button>
          </div>
          <div>
            <Button
              variant={"outline"}
              onClick={() => {
                navigate("/signin");
              }}
            >
              Signin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
