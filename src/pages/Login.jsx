import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Button,
  Alert,
} from "reactstrap";
import { login } from "../api/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({
        email: e.target.email.value,
        password: e.target.password.value,
      });

      loginUser(res.data.access_token);
      navigate("/profile");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <CardBody className="p-4">
          <CardTitle tag="h3" className="text-center mb-4">
            Welcome back 👋
          </CardTitle>

          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
              />
            </FormGroup>

            <FormGroup className="mb-4">
              <Input
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </FormGroup>

            <Button
              color="primary"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
