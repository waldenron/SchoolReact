import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setWithExpiry } from '../utils/utilityFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingSpinner } from './Common';

export default function Login() {
    const [loading, setLoading] = useState(false);

    const [showSignUp, setShowSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    const [msg, setMsg] = useState("");
    const [msgCss, setMsgCss] = useState("");
    const navigate = useNavigate();

    const timeToStayLoginMinutes = 10;
    const handleLogin = async () => {
        setLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL + '/api/Login';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserName: email, UserPass: password }),
        });

        if (response.ok) {
            const data = await response.json();
            setWithExpiry("token", data.token, timeToStayLoginMinutes);

            navigate('/InfoItems');
        } else {
            const error = await response.json();
            setMsg(error.Message);
            setMsgCss("alert alert-danger");
        }

        setLoading(false);
    };
    const handleForgetPassword = async () => {
        setLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL + '/api/ForgetPassword';

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserName: email }),
        });

        if (response.ok) {
            const data = await response.json();
            setMsg(data);
            setMsgCss("alert alert-success");
        } else {
            const error = await response.json();
            setMsg(error.Message);
            setMsgCss("alert alert-danger");
        }

        setLoading(false);
    };

    if (loading) { return <LoadingSpinner />; }
    return (
        <div className="container bgLight my-5 py-5 w-md-50">
            <h3 id="HeaderTitle" className="text-center">כניסה למערכת</h3>
            <div id="DivSignIn" className={`p-2 ${showSignUp ? 'd-none' : ''}`}>
                {/* ... rest of your login form ... */}
                <div className="input-group">
                    <span className="input-group-text before">כתובת דוא"ל</span>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" dir="ltr" placeholder="myMail@some.thing" />
                </div>
                <div className="input-group my-3">
                    <span className="input-group-text before">סיסמה</span>
                    <input value={password} onChange={e => setPassword(e.target.value)} type={isShowPassword ? "text" : "password"} className="form-control" dir="ltr" placeholder="password" />
                    <span className="input-group-text" onClick={() => setIsShowPassword(!isShowPassword)}><FontAwesomeIcon icon={`fas fa-eye${isShowPassword ? "" : "-slash"}`} /></span>
                </div>
                <button onClick={handleLogin} className="btn btn-secondary w-100">התחברות</button>
                <div id="divButtons" className="w-100 mt-3 text-center">
                    <span className="btn-link mx-3" onClick={handleForgetPassword}>שכחתי סיסמה</span>
                    |
                    <span onClick={() => setShowSignUp(true)} className="btn-link mx-3" role="button">רישום למורים חדשים</span>
                </div>
            </div>
            <div id="DivSignUp" className={`p-2 ${showSignUp ? '' : 'd-none'}`}>
                {/* ... registration form ... */}
            </div>
            {msg && <div className="pt-5 text-center"><span className={msgCss ? msgCss : ""}>{msg}</span></div>}
        </div>
    );
}