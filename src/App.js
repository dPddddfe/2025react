import React, { useState, useEffect } from 'react';
import './App.css';
import { Modal, Button } from 'react-bootstrap';

const API_URL = "https://69152a8e84e8bd126af8e315.mockapi.io/:endpoint";

const initialCreateFormState = {
  name: "",
  code: "",
  professor: "",
  major: "",
  credits: 0.0,
  place: "",
  time: "",
  grade: "-"
};

function App() {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState(initialCreateFormState);
  const [updateData, setUpdateData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCloseUpdateModal = () => setUpdateData(null);
  const showUpdateModal = updateData !== null;

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setCourses(data); 
    } catch (error) {
      console.error("Error fetching list:", error);
      alert("데이터 로딩 실패. API_URL을 확인하세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault(); 

    const newCourse = {
      ...formData,
      credits: Number(formData.credits)
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCourse)
      });

      if (response.ok) {
        alert('강의가 추가되었습니다!');
        fetchCourses(); 
        setFormData(initialCreateFormState); 
        handleCloseCreateModal();
      } else {
        throw new Error('Create failed');
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm(`정말로 ID ${id} 강의를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (response.ok) {
        alert('강의가 삭제되었습니다.');
        setCourses(courses.filter(course => course.id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const updatedCourse = {
      ...updateData,
      credits: Number(updateData.credits)
    };

    try {
      const response = await fetch(`${API_URL}/${updateData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCourse)
      });

      if (response.ok) {
        alert('강의 정보가 수정되었습니다.');
        fetchCourses(); 
        handleCloseUpdateModal(); 
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value
    });
  };

  const showUpdateForm = (course) => {
    setUpdateData(course);
  };

  useEffect(() => {
    fetchCourses();
  }, []); 

  return (
    <div className="container">
      <div className="jumbotron">
        <div className="container text-center">
          <h1>React 강의 관리 ⚛️</h1>
          <p>MockAPI와 React로 만든 CRUD 페이지입니다</p>
        </div>
      </div>
      
      <Button variant="primary" onClick={handleShowCreateModal} style={{ marginBottom: '20px' }}>
        📝 새 강의 추가
      </Button>

      <hr />

      <h2>수강 과목 (AJAX)</h2>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>과목명</th>
              <th>과목 코드</th>
              <th>담당 교수</th>
              <th>개설 학부</th>
              <th>학점</th>
              <th>강의 장소</th>
              <th>강의 시간</th>
              <th>성적</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan="9" className="text-center">Loading...</td></tr>
            )}

            {!loading && courses.length === 0 && (
              <tr><td colSpan="9" className="text-center">표시할 데이터가 없습니다.</td></tr>
            )}

            {!loading && courses.map(course => (
              <tr key={course.id}>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.professor}</td>
                <td>{course.major}</td>
                <td>{course.credits}</td>
                <td>{course.place}</td>
                <td>{course.time}</td>
                <td>{course.grade}</td>
                <td>
                  <button className="btn btn-sm btn-success" onClick={() => showUpdateForm(course)}>수정</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteCourse(course.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>📝 강의 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="create-modal-form" onSubmit={handleCreateSubmit} className="custom-form" style={{ maxWidth: 'none' }}>
            <div className="form-group">
              <label>과목 명:</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleCreateChange} placeholder="Course Name" required />
            </div>
            <div className="form-group">
              <label>과목 코드:</label>
              <input type="text" className="form-control" name="code" value={formData.code} onChange={handleCreateChange} placeholder="Course Code" required />
            </div>
            <div className="form-group">
              <label>담당 교수:</label>
              <input type="text" className="form-control" name="professor" value={formData.professor} onChange={handleCreateChange} placeholder="Professor" required />
            </div>
            <div className="form-group">
              <label>주관 학부:</label>
              <input type="text" className="form-control" name="major" value={formData.major} onChange={handleCreateChange} placeholder="Major" required />
            </div>
            <div className="form-group">
              <label>학점:</label>
              <input type="number" className="form-control" name="credits" value={formData.credits} onChange={handleCreateChange} placeholder="Credits" step="0.5" required />
            </div>
            <div className="form-group">
              <label>강의 장소:</label>
              <input type="text" className="form-control" name="place" value={formData.place} onChange={handleCreateChange} placeholder="Place" required />
            </div>
            <div className="form-group">
              <label>강의 시간:</label>
              <input type="text" className="form-control" name="time" value={formData.time} onChange={handleCreateChange} placeholder="Time (e.g., Tue 3, Fri 3)" required />
            </div>
            <div className="form-group">
              <label>성적:</label>
              <input type="text" className="form-control" name="grade" value={formData.grade} onChange={handleCreateChange} />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            닫기
          </Button>
          <Button variant="primary" type="submit" form="create-modal-form">
            강의 추가
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>🔄 강의 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="update-modal-form" onSubmit={handleUpdateSubmit} className="custom-form" style={{ maxWidth: 'none' }}>
            <div className="form-group">
              <label>과목 명:</label>
              <input type="text" className="form-control" name="name" value={updateData?.name} onChange={handleUpdateChange} required />
            </div>
            <div className="form-group">
              <label>과목 코드:</label>
              <input type="text" className="form-control" name="code" value={updateData?.code} onChange={handleUpdateChange} required />
            </div>
            <div className="form-group">
              <label>담당 교수:</label>
              <input type="text" className="form-control" name="professor" value={updateData?.professor} onChange={handleUpdateChange} required />
            </div>
            <div className="form-group">
              <label>주관 학부:</label>
              <input type="text" className="form-control" name="major" value={updateData?.major} onChange={handleUpdateChange} required />
            </div>
            <div className="form-group">
              <label>학점:</label>
              <input type="number" className="form-control" name="credits" value={updateData?.credits} onChange={handleUpdateChange} step="0.5" required />
            </div>
            <div className="form-group">
              <label>강의 장소:</label>
              <input type="text" className="form-control" name="place" value={updateData?.place} onChange={handleUpdateChange} required />
            </div>
            <div className="form-group">
              <label>강의 시간:</label>
              <input type="text" className="form-control" name="time" value={updateData?.time} onChange={handleUpdateChange} required />
            </div>
            <div className="form-group">
              <label>성적:</label>
              <input type="text" className="form-control" name="grade" value={updateData?.grade} onChange={handleUpdateChange} required />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            취소
          </Button>
          <Button variant="primary" type="submit" form="update-modal-form">
            수정 완료
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;