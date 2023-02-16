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
  const [imageSrc, setImageSrc] = useState(defaultImage);
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const [editID, setEditID] = useState("");
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editIsActive, setEditIsActive] = useState(0);
  const [editImageSrc, setEditImageSrc] = useState();
  const [editImageFile, setEditImageFile] = useState("");
  const [editImageName, setEditImageName] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = (id) => {
    axios
      .get(`https://localhost:7262/api/Employee/${id}`)
      .then((result) => {
        for (var i = 0; i < data.length; i++) {
          if (id === data[i].id) {
            result.data.imageSrc = data[i].imageSrc;
          }
          console.log(data[i].name);
        }
        console.log(result.data.imageSrc);
        setEditImageSrc(result.data.imageSrc);
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
          console.log(err);
        });
    }
  };

  const handleUpdate = () => {
    const url = `https://localhost:7262/api/Employee/${editID}`;
    const formData = new FormData();
    formData.append("imageFile", editImageFile);
    formData.append("id", editID);
    formData.append("name", editName);
    formData.append("age", editAge);
    formData.append("isActive", editIsActive);
    formData.append("imageName", editImageName);

    console.log("edit", editImageFile);
    console.log("edit", editID);
    console.log("edit", editName);
    console.log("edit", editAge);
    console.log("edit", editIsActive);
    console.log("edit", editImageName);

    axios
      .put(url, formData)
      .then((result) => {
        handleClose();
        getData();
        toast.success("Employee has been updated");
      })
      .catch((er) => {
        toast.error(er);
        console.log(er);
      });
  };

  const handleSave = () => {
    const url = "https://localhost:7262/api/Employee";

    const formData = new FormData();
    formData.append("imageFile", imageFile);

    formData.append("name", name);
    formData.append("age", age);
    formData.append("isActive", isActive);
    formData.append("imageName", imageName);

    console.log("formData", formData);
    console.log("imageName.name", imageFile.name);
    console.log("imageName", imageName);

    axios
      .post(url, formData)
      .then((result) => {
        console.log("into then", result);
        console.log("formData", formData.data);
        getData();
        clear();
        toast.success("Employee has been added");
      })
      .catch((er) => {
        toast.error(er);
        if (er.response) {
          console.log("response", er.response);
        } else if (er.request) {
          console.log("request", er.request);
        } else console.log("failSave", er);
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
    setImageFile("");
  };

  const getData = () => {
    axios
      .get("https://localhost:7262/api/Employee")
      .then((result) => {
        setData(result.data);
        console.log("get data", result.data);
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
        setImageSrc(x.target.result);
      };
      reader.readAsDataURL(imageFile);

      console.log("sssssss3", imageFile.name);
    } else {
      setImageFile(null);
      setImageSrc(defaultImage);
      console.log("failShow");
    }
  };

  const showPreviewUpdate = (e) => {
    console.log("ssssupdate");
    if (e.target.files && e.target.files[0]) {
      let editImageFile = e.target.files[0];
      const reader = new FileReader();
      console.log("ssssupdate2");
      reader.onload = (x) => {
        setEditImageFile(editImageFile);
        setEditImageSrc(x.target.result);
      };
      reader.readAsDataURL(editImageFile);

      console.log("sssssupdate3", editImageFile.name);
    } else {
      setEditImageFile(null);
      setEditImageSrc(defaultImage);
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
            <input type="file" accept="image/*" onChange={showPreview} />
          </Col>
          <Col>
            <img src={imageSrc} className="card-image" />
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
                    <td>
                      <img
                        src={`${item.imageSrc}`}
                        className="card-image"
                        alt=""
                      />
                    </td>
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
              <input
                type="file"
                accept="image/*"
                onChange={showPreviewUpdate}
              />
            </Col>
            <Col>
              <img src={editImageSrc} className="card-image" />
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
