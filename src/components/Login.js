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

        console.log("handleSendCode");

        const apiUrl = process.env.REACT_APP_API_URL + currentStage.api;
        console.log(isStage("reg1_SendCode"));
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

            setCurrentStage(toStage("reg2_ApproveCode"));
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

            setCurrentStage(toStage("reg3_Details"));
        } else {
            const error = await response.json();
            setMsg(error.Message);
            setMsgCss("alert alert-danger");
        }

        setLoading(false);
    };

    const handleRegister = async () => {
        setLoading(true);

        console.log("handleRegister");

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
    const getHandleFunction = () => {
        switch (currentStage.stage) {
            case "login": return handleLogin;
            //case "forgotPassword": return handleForgotPassword;//call directlly, because it is not a regular stage
            case "reg1_SendCode": return handleSendCode;
            case "reg2_ApproveCode": return handleAuthenticateCode;
            case "reg3_Details": return handleRegister;
            default: return () => { console.error("Unknown stage:", currentStage.stage); };
        }
    }

    function toStage(stageToFind) {
        return stages.find(stage => stage.stage.toLowerCase() === stageToFind.toLowerCase());
    }
    function isStage(stageToFind) {
        return currentStage.stage.toLowerCase() === stageToFind.toLowerCase();
    }
    const stages = [
        { stage: "login", header: "כניסה למערכת", btnText: "התחברות", showPassInput: true, api: "/api/Login" },
        { stage: "forgotPassword", header: "כניסה למערכת", btnText: "התחברות", showPassInput: true, api: "/api/ForgetPassword" },
        { stage: "reg1_SendCode", header: "רישום למערכת", btnText: "אישור", showPassInput: false, api: "/api/SendCode" },
        { stage: "reg2_ApproveCode", header: "רישום למערכת", btnText: "שליחה", showPassInput: false, api: "/api/AuthenticateCode" },
        { stage: "reg3_Details", header: "רישום למערכת", btnText: "הרשמה", showPassInput: true, api: "/api/Register" },
    ]
    const [currentStage, setCurrentStage] = useState(toStage("reg3_Details"));
    //const [currentStage, setCurrentStage] = useState(toStage("login"));

    if (loading) { return <LoadingSpinner />; }
    const header = currentStage.header;
    document.title = toPageTitle(header);
    const btnText = currentStage.btnText;
    return (
        <div className="container bgLight my-5 py-3 w-md-40 text-center">
            <h3 className="text-center">{header}</h3>
            <div className="p-2 w-md-75 mx-auto">
                <div className={`d-inline-block mx-auto my-3${!isStage("reg1_SendCode") ? " d-none" : ""}`}>
                    הרישום מיועד למורים חדשים בלבד (רק לאלו שטרם נרשמו).<br />
                    יש לרשום כתובת דוא"ל אליה המערכת תשלח קוד אימות.
                </div>
                <div className="input-group">
                    <span className="input-group-text before">כתובת דוא"ל</span>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control"
                        dir="ltr" placeholder="myMail@some.thing" disabled={isStage("reg3_Details") ? " disabled" : ""} />
                </div>
                <div id="DivSignUp" className={`p-2${!isStage("reg3_Details") ? ' d-none' : ''}`}>
                    <h5 className="mt-2">פרטי הרישום</h5>
                    <div className="input-group mt-2">
                        <span className="input-group-text">שם מלא</span>
                        <input type="text" className="form-control" placeholder="פרטי" />
                        <input type="text" className="form-control" placeholder="משפחה" />
                    </div>
                    <div className="mt-4 text-end">
                        <h6 className="bullet">סיסמה מורכבת מאותיות באנגלית וספרות <b>בלבד</b>.</h6>
                        <h6 className="bullet">לפחות <b>אות אחת באנגלית</b> ולפחות <b>סִפְרַה אחת</b>. מינימום <b>4 תווים</b>.</h6>
                    </div>
                </div>
                <div className={`input-group my-3${!currentStage.showPassInput ? " d-none" : ""}`}>
                    <span className="input-group-text before">{!isStage("reg3_Details") ? "סיסמה" : "סיסמה מבוקשת"}</span>
                    <input value={password} onChange={e => setPassword(e.target.value)} type={isShowPassword ? "text" : "password"} className="form-control" dir="ltr" placeholder="password" />
                    <span className="input-group-text" onClick={() => setIsShowPassword(!isShowPassword)}><FontAwesomeIcon icon={`fas fa-eye${isShowPassword ? "" : "-slash"}`} /></span>
                </div>
                <div className={`input-group my-3${!isStage("reg2_ApproveCode") ? " d-none" : ""}`}>
                    <span className="input-group-text before">קוד</span>
                    <input value={code} onChange={e => setCode(e.target.value)} type="text" className="form-control" dir="ltr" placeholder="xxxxx" />
                </div>
                <div className={`d-inline-block mx-auto mt-1 mb-3${!isStage("reg1_SendCode") ? " d-none" : ""}`}>
                    ◼ קוד אימות יישלח לכתובת זאת לאחר לחיצה על אישור
                </div>
                <button onClick={getHandleFunction()} className="btn btn-secondary w-md-75">{btnText}</button>
                <div className={`mt-3${!isStage("login") ? " d-none" : ""}`}>
                    <span className="btn-link mx-3" onClick={handleForgotPassword} role="button">שכחתי סיסמה</span>
                    |
                    <span onClick={() => setCurrentStage(toStage("reg1_SendCode"))} className="btn-link mx-3" role="button">רישום למורים חדשים</span>
                </div>
                <div className={`mt-3${!isStage("reg1_SendCode") ? " d-none" : ""}`}>
                    <span className="btn-link mx-3" onClick={getHandleFunction()} role="button">שלח שוב</span>
                    |
                    <span onClick={() => setCurrentStage(toStage("login"))} className="btn-link mx-3" role="button">חזרה לכניסה למערכת</span>
                </div>
            </div>
            <div className="pt-5 text-center">
                <span className={`d-inline-block ${msgCss ? msgCss : ""}`}>{msg}</span>
            </div>
        </div>
    );
}