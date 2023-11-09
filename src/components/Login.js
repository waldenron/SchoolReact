import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData, getHomePageUrl } from '../utils/apiServices';
import { setWithExpiry, toPageTitle } from '../utils/utilityFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LoadingSpinner, ToLink } from './Common';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [homePageUrl, setHomePageUrl] = useState(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [code, setCode] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [message, setMessage] = useState({ text: "", css: "" });
    
    
    const navigate = useNavigate();
    const timeToStayLoginMinutes = 10;
    const handleLogin = async () => {
        setLoading(true);

        const bodyItems = { UserName: email, UserPass: password };
        const response = await fetchData(toStage("login").api, null, null, [], bodyItems, "POST");

        if (!response.error) {
            setWithExpiry("token", response.data.token, timeToStayLoginMinutes);
            navigate('/InfoItems');
        }
        else setMessage({ text: response.error, css: "alert alert-alert" });

        setLoading(false);
    };
    const handleForgotPassword = async () => {
        setLoading(true);

        const bodyItems = { UserName: email };
        const response = await fetchData(toStage("forgotPassword").api, null, null, [], bodyItems, "POST");

        if (!response.error) setMessage({ text: response.data, css: "alert alert-success" });
        else setMessage({ text: response.error, css: "alert alert-alert" });

        setLoading(false);
    };
    const handleSendCode = async () => {
        setLoading(true);

        const bodyItems = { UserName: email };
        const response = await fetchData(toStage("reg1_SendCode").api, null, null, [], bodyItems, "POST");

        if (!response.error) {
            setMessage({ text: response.data, css: "alert alert-success" });
            setCurrentStage(toStage("reg2_ApproveCode"));
        }
        else setMessage({ text: response.error, css: "alert alert-alert" });

        setLoading(false);
    };
    const handleAuthenticateCode = async () => {
        setLoading(true);

        const bodyItems = { UserName: email, Code: code };
        const response = await fetchData(currentStage.api, null, null, [], bodyItems, "POST");

        if (!response.error) {
            setMessage({ text: response.data, css: "alert alert-success" });
            setCurrentStage(toStage("reg3_Details"));
        }
        else setMessage({ text: response.error, css: "alert alert-alert" });

        setLoading(false);
    };
    const handleRegister = async () => {
        setLoading(true);

        setHomePageUrl(await getHomePageUrl());

        const bodyItems = { UserName: email, Code: code, FirstName: firstName, LastName: lastName, UserPass: password };
        const response = await fetchData(currentStage.api, null, null, [], bodyItems, "POST");

        if (!response.error) {
            setMessage({ text: response.data, css: "alert alert-success" });
            setCurrentStage(toStage("reg4_Done"));
        }
        else setMessage({ text: response.error, css: "alert alert-alert" });

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
        { stage: "login", header: "כניסה למערכת", btnText: "התחברות", showPassInput: true, enableEmailInput: true, api: "/api/Login" },
        { stage: "forgotPassword", header: "כניסה למערכת", btnText: "התחברות", showPassInput: true, enableEmailInput: true, api: "/api/ForgetPassword" },
        { stage: "reg1_SendCode", header: "רישום למערכת", btnText: "אישור", showPassInput: false, enableEmailInput: true, api: "/api/SendCode" },
        { stage: "reg2_ApproveCode", header: "רישום למערכת", btnText: "שליחה", showPassInput: false, enableEmailInput: false, api: "/api/AuthenticateCode" },
        { stage: "reg3_Details", header: "רישום למערכת", btnText: "הרשמה", showPassInput: true, enableEmailInput: false, api: "/api/Register" },
        { stage: "reg4_Done", header: "רישום למערכת", btnText: "", showPassInput: false, enableEmailInput: false, api: "" },
    ]
    const [currentStage, setCurrentStage] = useState(toStage("login"));

    if (loading) { return <LoadingSpinner />; }
    const header = currentStage.header;
    document.title = toPageTitle(header);
    const btnText = currentStage.btnText;
    return (
        <div className="container bgLight my-5 py-3 w-md-40 text-center">
            <h3 className="text-center">{header}</h3>
            <div className="p-2 w-md-75 mx-auto">
                {isStage("reg1_SendCode") && <div className="d-inline-block mx-auto my-3">
                    הרישום מיועד למורים חדשים בלבד (רק לאלו שטרם נרשמו).<br />
                    יש לרשום כתובת דוא"ל אליה המערכת תשלח קוד אימות.
                </div>}
                <div className="input-group">
                    <span className="input-group-text before">כתובת דוא"ל</span>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-control"
                        dir="ltr" placeholder="myMail@some.thing" disabled={!currentStage.enableEmailInput} />
                </div>
                {isStage("reg3_Details") && <div id="DivSignUp" className="p-2">
                    <h5 className="mt-2">פרטי הרישום</h5>
                    <div className="input-group mt-2">
                        <span className="input-group-text">שם מלא</span>
                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="form-control" placeholder="פרטי" />
                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="form-control" placeholder="משפחה" />
                    </div>
                    <div className="mt-4 text-end">
                        <h6 className="bullet">סיסמה מורכבת מאותיות באנגלית וספרות <b>בלבד</b>.</h6>
                        <h6 className="bullet">לפחות <b>אות אחת באנגלית</b> ולפחות <b>סִפְרַה אחת</b>. מינימום <b>4 תווים</b>.</h6>
                    </div>
                </div>}
                {currentStage.showPassInput && <div className="input-group my-3">
                    <span className="input-group-text before">{!isStage("reg3_Details") ? "סיסמה" : "סיסמה מבוקשת"}</span>
                    <input value={password} onChange={e => setPassword(e.target.value)} type={isShowPassword ? "text" : "password"} className="form-control" dir="ltr" placeholder="password" />
                    <span className="input-group-text" onClick={() => setIsShowPassword(!isShowPassword)}><FontAwesomeIcon icon={`fas fa-eye${isShowPassword ? "" : "-slash"}`} /></span>
                </div>}
                {isStage("reg2_ApproveCode") && <div className="input-group my-3">
                    <span className="input-group-text before">קוד</span>
                    <input value={code} onChange={e => setCode(e.target.value)} type="text" className="form-control" dir="ltr" placeholder="xxxxx" />
                </div>}
                <div className={`d-inline-block mx-auto mt-1 mb-3${!isStage("reg1_SendCode") ? " d-none" : ""}`}>
                    ◼ קוד אימות יישלח לכתובת זאת לאחר לחיצה על אישור
                </div>
                {btnText && <button onClick={getHandleFunction()} className="btn btn-secondary w-md-75">{btnText}</button>}
                {isStage("reg4_Done") && <ToLink to={homePageUrl} target="_self"><h5 className="mt-3">חזרה לעמוד הבית</h5></ToLink>}
                <div className={`mt-3${!isStage("login") ? " d-none" : ""}`}>
                    <span className="btn-link mx-3" onClick={handleForgotPassword} role="button">שכחתי סיסמה</span>
                    |
                    <span onClick={() => setCurrentStage(toStage("reg1_SendCode"))} className="btn-link mx-3" role="button">רישום למורים חדשים</span>
                </div>
                {isStage("reg2_ApproveCode") && <div className="mt-3">
                    <span className="btn-link mx-3" onClick={handleSendCode} role="button">שלח שוב</span>
                    |
                    <span onClick={() => setCurrentStage(toStage("login"))} className="btn-link mx-3" role="button">חזרה לכניסה למערכת</span>
                </div>}
            </div>
            <div className="pt-5 text-center">
                <span className={`d-inline-block${message.css ? ` ${message.css}` : ""}`}>{message.text}</span>
            </div>
        </div >
    );
}