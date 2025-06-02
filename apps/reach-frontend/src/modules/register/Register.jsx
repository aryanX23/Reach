import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IonIcon } from '@ionic/react';
import { mail, lockClosed, person, closeCircle, checkmarkCircle, alertCircle } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil/toastUtil';

import { registerUser } from '../../store/slices/loginSlices';

import './register.css';


export default function Register() {
  const ref = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });

  const authState = useSelector(state => state?.login?.loginDetails?.authenticated || false);

  async function handleRegister(e) {
    e.preventDefault();
    try {
      if (userDetails.password !== userDetails.confirmPassword) {
        setUserDetails(prev => ({
          ...prev,
          password: "",
          confirmPassword: ""
        }));
        showErrorToast("Passwords do not Match!");
      }
      else {
        const bodyFormData = {
          name: userDetails.fullName,
          email: userDetails.email,
          password: userDetails.password
        };

        await dispatch(registerUser(bodyFormData))
          .then(res => res.payload)
          .then(res => {
            const { status = false, message } = res || {};
            if (status === "success") {
              setUserDetails(prev => ({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: ""
              }));
              ref.current.checked = false;
              showSuccessToast("User Registered Successfully!");
              navigate("/login");
            } else {
              showErrorToast(message || "Something went wrong, Pls try again!");
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    setUserDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  useEffect(() => {
    if (authState) {
      navigate("/dashboard");
    }
  }, [navigate, authState]);

  return (
    <div className="signInBody">
      <img
        src={"/images/signupbg1.jpg"}
        alt="background"
        className="signInbg"
      />

      <div className="headerBody">
        <div className="headerTitle">
          <img className='websiteLogo' src='/images/logo2.png' alt='logo' />
          <span>Reach</span>
        </div>
        <div>
          <button
            onClick={() => {
              navigate("/login");
            }}
            className="actionButton"
          >
            Login
          </button>
        </div>
      </div>
      <div className="formWrapper">
        <div className="form-box">
          <h2>Register</h2>
          
          <form onSubmit={handleRegister}>
            <div className="input-box">
              <span className="icon">
                <IonIcon icon={person} />
              </span>
              <input
                type="text"
                onChange={handleChange}
                value={userDetails.fullName}
                name="fullName"
                placeholder=" "
                required
              />
              <label>Full Name</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IonIcon icon={mail} />
              </span>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={userDetails.email}
                placeholder=" "
                required
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IonIcon icon={lockClosed} />
              </span>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={userDetails.password}
                placeholder=" "
                required
              />
              <label>Password</label>
            </div>
            <div className="input-box">
              <span className="icon">
                <IonIcon icon={lockClosed} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                value={userDetails.confirmPassword}
                placeholder=" "
                required
              />
              <label>Confirm Password</label>
            </div>
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  ref={(element) => {
                    ref.current = element;
                  }}
                  required
                />
                <Link>Accept Our Terms and Conditions?</Link>
              </label>
            </div>
            <button type="submit" className="btn">
              Register
            </button>
            <div className="login-register">
              <p>
                Already have an account?
                <Link to="/login">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}