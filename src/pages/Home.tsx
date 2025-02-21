import { useAuth } from "../contexts/AuthProvider";

const Home = () => {
  const { logout } = useAuth();
  return (
    <div>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

export default Home;
