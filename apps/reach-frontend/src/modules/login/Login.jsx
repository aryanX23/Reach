import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { IonIcon } from '@ionic/react';
import { mail, lockClosed } from 'ionicons/icons';

import { loginUser } from '../../store/slices/loginSlices';
import { showErrorToast, showSuccessToast } from '../../utils/ToastUtil/toastUtil';

import './Login.css';


export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userDetails, setUserDetails] = useState({ email: "", password: "" });

  function handleChange(e) {
    setUserDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const bodyFormData = {
      email: userDetails.email,
      password: userDetails.password
    };

    dispatch(loginUser(bodyFormData)).then(res => res.payload)
      .then(res => {
        const { status = false, message = "Something went wrong, Pls try again!" } = res || {};

        if (status === "success") {
          showSuccessToast("Login Successful");
          navigate('/dashboard');
        } else if (!status || status === "fail") {
          showErrorToast(message);
        }
      });
  }

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
            className="actionButton"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </button>
        </div>
      </div>

      <div className="formWrapper">
        <div className="form-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <span className="icon">
                <IonIcon icon={mail} />
              </span>
              <input
                type="email"
                onChange={handleChange}
                name="email"
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
                onChange={handleChange}
                name="password"
                value={userDetails.password}
                placeholder=" "
                required
              />
              <label>Password</label>
            </div>
            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember Me
              </label>
              <Link>Forgot Password?</Link>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <div className="login-register">
              <p>
                Don&apos;t have an account?
                <Link to="/register">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}