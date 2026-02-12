import {
  Modal,
  ModalBody,
  ModalHeader
} from "reactstrap";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AuthModal = ({ type, isOpen, toggle }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        {type === "login" ? "Login" : "Register"}
      </ModalHeader>
      <ModalBody>
        {type === "login" ? <Login /> : <Register />}
      </ModalBody>
    </Modal>
  );
};

export default AuthModal;
