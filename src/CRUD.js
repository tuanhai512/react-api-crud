import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const CRUD = () => {
  const defaultImage = "../img/1269202-200.png";

  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isActive, setIsAcive] = useState(0);

  const [editID, setEditID] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);
  const [img, settImage] = useState(defaultImage);
  const [imgFile, setImageFile] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = (id) => {
    axios
      .get(`https://localhost:7262/api/Employee/${id}`)
      .then((result) => {
        setEditName(result.data.name);
        setEditAge(result.data.age);
        setEditIsActive(result.data.isActive);
        setEditID(id);
      })
      .catch((er) => {
        console.log(er);
      });
    handleShow();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete ? ")) {
      axios
        .delete(`https://localhost:7262/api/Employee/${id}`)
        .then((result) => {
          if (result.status === 200) {
            toast.success("Employee has been deleted");
            getData();
          }
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7262/api/Employee/${editID}`;
    const data = {
      id: editID,
      name: editName,
      age: editAge,
      isActive: editIsActive,
    };
    axios
      .put(url, data)
      .then((result) => {
        handleClose();
        getData();
        toast.success("Employee has been updated");
      })
      .catch((er) => {
        toast.error(er);
      });
  };

  const handleSave = () => {
    const formData = new FormData();

    const url = "https://localhost:7262/api/Employee";
    const data = {
      name: name,
      age: age,
      isActive: isActive,
    };
    formData.append("data", new Blob([JSON.stringify(data)]), {
      type: "application/json",
    });
    formData.append("file", imgFile);
    console.log("data", data);
    axios
      .post(url, {formData,data})
      .then((result) => {
        console.log("into then", result);
        getData();
        clear();
        toast.success("Employee has been added");
      })
      .catch((er) => {
        toast.error(er);
        console.log("failSave", er);
      });
  };

  const handleActiveChange = (e) => {
    if (e.target.checked) {
      setIsAcive(1);
    } else {
      setIsAcive(0);
    }
  };

  const handleEditActiveChange = (e) => {
    if (e.target.checked) {
      setEditIsActive(1);
    } else {
      setEditIsActive(0);
    }
  };
  const clear = () => {
    setName("");
    setAge("");
    setIsAcive(0);
    setEditName("");
    setEditAge("");
    setEditIsActive(0);
    setEditID("");
  };

  const getData = () => {
    axios
      .get("https://localhost:7262/api/Employee")
      .then((result) => {
        setData(result.data);
      })
      .catch((er) => {
        console.log(er);
      });
  };

  const showPreview = (e) => {
    console.log("sssssss");
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      console.log("sssssss2");
      reader.onload = (x) => {
        setImageFile(imageFile);
        settImage(x.target.value);
      };
      reader.readAsDataURL(imageFile);

      console.log("sssssss3", imageFile);
    } else {
      setImageFile(null);
      settImage(defaultImage);
      console.log("failShow");
    }
  };
  return (
    <>
      <Container>
        <ToastContainer />
        <Row>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="please enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="text"
              className="form-control"
              placeholder="please enter age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Col>
          <Col>
            <input
              type="checkbox"
              checked={isActive === 1 ? true : false}
              onChange={(e) => handleActiveChange(e)}
              value={isActive}
            />
            <label>IsActive</label>
            <input
              type="file"
              accept="image.png, image.jpeg"
              onChange={showPreview}
            />
          </Col>
          <Col>
            <img src={img} className="card-image" />
          </Col>
          <Col>
            <button className="btn btn-primary" onClick={() => handleSave()}>
              Submit
            </button>
          </Col>
        </Row>
      </Container>
      <br></br>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0
            ? data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.age}</td>
                    <td>{item.isActive}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>{" "}
                      &nbsp;
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            : "Loading..."}
        </tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="please enter name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="text"
                className="form-control"
                placeholder="please enter age"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
              />
            </Col>
            <Col>
              <input
                type="checkbox"
                checked={editIsActive === 1 ? true : false}
                onChange={(e) => handleEditActiveChange(e)}
                value={editIsActive}
              />
              <label>IsActive</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CRUD;
