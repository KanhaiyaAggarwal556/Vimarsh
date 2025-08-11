import { useParams } from "react-router-dom";
import Login from "../../components/Account/Login/Login";

export default function LoginPage(): JSX.Element {
  const query = useParams();
  console.log(query);
  return <Login />;
}
