import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <p style={{ color: "red", fontSize: "100px" }}>
        {error.status == "404" ? "404 Page Not Found" : ""}
      </p>
    </div>
  );
}
