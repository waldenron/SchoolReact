import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setWithExpiry, toPageTitle } from '../utils/utilityFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingSpinner } from './Common';

export default function Login() {
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [code, setCode] = useState("");

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
    const handleForgotPassword = async () => {
        setLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL + toStage("forgotPassword").api;
        console.log(isStage("sendCode"));
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
    const handleSendCode = async () => {
        setLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL + currentStage.api;
        console.log(isStage("sendCode"));
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

            setCurrentStage(toStage("approveCode"));
        } else {
            const error = await response.json();
            setMsg(error.Message);
            setMsgCss("alert alert-danger");
        }

        setLoading(false);
    };
    const handleAuthenticateCode = async () => {
        setLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL + currentStage.api;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserName: email, Code: code }),
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

    const handleRegister = async () => {
        setLoading(true);

        const apiUrl = process.env.REACT_APP_API_URL + currentStage.api;
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ UserName: email, Code: code }),
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

    function toStage(stageToFind) {
        return stages.find(stage => stage.stage.toLowerCase() === stageToFind.toLowerCase());
    }
    function isStage(stageToFind) {
        return currentStage.stage.toLowerCase() === stageToFind.toLowerCase();
    }
    const stages = [
        { stage: "login", header: "כניסה למערכת", btnText: "התחברות", handleFunction: handleLogin, api: "/api/Login" },
        { stage: "forgotPassword", header: "כניסה למערכת", btnText: "התחברות", handleFunction: handleForgotPassword, api: "/api/ForgetPassword" },
        { stage: "sendCode", header: "רישום למערכת", btnText: "אישור", handleFunction: handleSendCode, api: "/api/SendCode" },
        { stage: "approveCode", header: "רישום למערכת", btnText: "שליחה", handleFunction: handleAuthenticateCode, api: "/api/AuthenticateCode" },
        { stage: "register", header: "רישום למערכת", btnText: "התחברות", handleFunction: handleRegister, api: "/api/Register" },
    ]
    const [currentStage, setCurrentStage] = useState(toStage("login"));

    if (loading) { return <LoadingSpinner />; }
    const header = currentStage.header;
    document.title = toPageTitle(header);
    const btnText = currentStage.btnText;
    return (
        <div className="container bgLight my-5 py-3 w-md-50 text-center">
            <h3 className="text-center">{header}</h3>
            <div className="p-2 w-md-75 mx-auto">
                <div className={`d-inline-block mx-auto my-3${!isStage("sendCode") ? " d-none" : ""}`}>
                    הרישום מיועד למורים חדשים בלבד (רק לאלו שטרם נרשמו).<br />
                    יש לרשום כתובת דוא"ל אליה המערכת תשלח קוד אימות.
                </div>
                <div className="input-group">
                    <span className="input-group-text before">כתובת דוא"ל</span>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" dir="ltr" placeholder="myMail@some.thing" />
                </div>
                <div className={`input-group my-3${!isStage("login") ? " d-none" : ""}`}>
                    <span className="input-group-text before">סיסמה</span>
                    <input value={password} onChange={e => setPassword(e.target.value)} type={isShowPassword ? "text" : "password"} className="form-control" dir="ltr" placeholder="password" />
                    <span className="input-group-text" onClick={() => setIsShowPassword(!isShowPassword)}><FontAwesomeIcon icon={`fas fa-eye${isShowPassword ? "" : "-slash"}`} /></span>
                </div>
                <div className={`input-group my-3${!isStage("approveCode") ? " d-none" : ""}`}>
                    <span className="input-group-text before">קוד</span>
                    <input value={code} onChange={e => setCode(e.target.value)} type="text" className="form-control" dir="ltr" placeholder="xxxxx" />
                </div>
                <div className={`d-inline-block mx-auto mt-1 mb-3${!isStage("sendCode") ? " d-none" : ""}`}>
                    ◼ קוד אימות יישלח לכתובת זאת לאחר לחיצה על אישור
                </div>
                <button onClick={currentStage.handleFunction} className="btn btn-secondary w-md-75">{btnText}</button>
                <div className={`mt-3${!isStage("login") ? " d-none" : ""}`}>
                    <span className="btn-link mx-3" onClick={currentStage.handleFunction} role="button">שכחתי סיסמה</span>
                    |
                    <span onClick={() => setCurrentStage(toStage("sendCode"))} className="btn-link mx-3" role="button">רישום למורים חדשים</span>
                </div>
                <div className={`mt-3${!isStage("sendCode") ? " d-none" : ""}`}>
                    <span className="btn-link mx-3" onClick={currentStage.handleFunction} role="button">שלח שוב</span>
                    |
                    <span onClick={() => setCurrentStage(toStage("login"))} className="btn-link mx-3" role="button">חזרה לכניסה למערכת</span>
                </div>
            </div>
            <div id="DivSignUp" className={`p-2 ${!isStage("register") ? '' : 'd-none'}`}>
                {/* ... registration form ... */}
            </div>
            <div className="pt-5 text-center">
                <span className={`d-inline-block ${msgCss ? msgCss : ""}`}>{msg}</span>
            </div>
        </div>
    );
}