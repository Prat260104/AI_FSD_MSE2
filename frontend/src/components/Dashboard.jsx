import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updatePassword, updateCourse, getProfile } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Password update form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  // Course update form
  const [courseData, setCourseData] = useState({
    course: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.data.success) {
        setStudent(response.data.student);
        setCourseData({ course: response.data.student.course });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // If token is invalid, user will be redirected by axios interceptor
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleCourseChange = (e) => {
    setCourseData({
      course: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await updatePassword(passwordData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '' });
      }
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to update password' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const response = await updateCourse(courseData);
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Course updated successfully!' });
        setStudent(response.data.student);
        localStorage.setItem('student', JSON.stringify(response.data.student));
      }
    } catch (err) {
      setMessage({ 
        type: 'danger', 
        text: err.response?.data?.message || 'Failed to update course' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    navigate('/login');
  };

  if (!student) {
    return (
      <div className="dashboard-container">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {student.name}!</h1>
          <p className="text-muted mb-0">Manage your profile and settings</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        {/* Student Information */}
        <div className="student-info">
          <h3 className="mb-4">Student Details</h3>
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{student.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{student.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Course:</span>
            <span className="info-value">{student.course}</span>
          </div>
        </div>

        {/* Update Password Section */}
        <div className="update-section">
          <h3>Update Password</h3>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label htmlFor="oldPassword" className="form-label">Old Password</label>
              <input
                type="password"
                className="form-control"
                id="oldPassword"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                placeholder="Enter old password"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                minLength="6"
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Update Course Section */}
        <div className="update-section">
          <h3>Change Course</h3>
          <form onSubmit={handleCourseSubmit}>
            <div className="mb-3">
              <label htmlFor="course" className="form-label">Course</label>
              <input
                type="text"
                className="form-control"
                id="course"
                name="course"
                value={courseData.course}
                onChange={handleCourseChange}
                required
                placeholder="Enter new course"
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Course'}
            </button>
          </form>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-4">
          <button 
            onClick={handleLogout} 
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
