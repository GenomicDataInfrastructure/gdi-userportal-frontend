import Error from "./error";

export default function NotFound() {
  return <Error statusCode={404} />;
}
