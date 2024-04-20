import { Button } from "antd";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 right-0 w-fill bg-gray-50 p-2 flex justify-center gap-2">
      {/* <Link href={"/hygen-test"}>
        <Button>Hygen test</Button>
      </Link> */}
      <Link href={"/gemini-center"}>
        <Button type="primary"> Google Gemnini</Button>
      </Link>
      <Link href={"/"}>
        {" "}
        <Button type="dashed" className="flex flex-row items-center w-fit">
          {" "}
          <ChevronLeft className="m4-1 h-4 w-4 inline" /> <span> Go Back</span>
        </Button>
      </Link>
    </div>
  );
};

export default Navbar;
