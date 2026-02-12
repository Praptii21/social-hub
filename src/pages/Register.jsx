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
import { register } from "../api/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({
        username: e.target.username.value,
        email: e.target.email.value,
        password: e.target.password.value,
      });

      navigate("/login");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <CardBody className="p-4">
          <CardTitle tag="h3" className="text-center mb-4">
            Create account 🚀
          </CardTitle>

          {error && <Alert color="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Input
                name="username"
                placeholder="Username"
                required
              />
            </FormGroup>

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
              color="success"
              className="w-100"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Register;
