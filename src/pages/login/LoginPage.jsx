import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import logo_img from '../../config/img/logo.png'
import configData from "../../config/config.json"
import "../../css/login.css"
import "../../css/modal.css"
import ModalOk from "../../component/modal/ModalOk";
import { useDispatch } from "react-redux";
import { setIsLoggedIn } from "../../slice/UserSlice";

export default function LoginPage() {

    const [name, setName] = useState();
    const [isEmpty, setIsEmpty] = useState(false);
    const [isFail, setIsFail] = useState(false);
    const [loginInfo, setLoginInfo] = useState({isSuccess: false, id: ''});
    const [message, setMessage] = useState("로그인 에러");
    const navigate = useNavigate();

    const dispath = useDispatch();

    function getName() {
        setName(configData.NAME);
    }

    const afterSuccess = () => {
        dispath(setIsLoggedIn(loginInfo.id));
        setLoginInfo({isSuccess: false, id: ''});
        navigate('/');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputData = new FormData(e.target);
        const value = Object.fromEntries(inputData.entries());
        let model = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(value),
        };

        if (inputData.get("id") == "" || inputData.get("password") == "") {
            setIsEmpty(true);
            return;
        }

        try {
            const res = await fetch(configData.API_SERVER + 'auth/login', model);
            const data = await res.json();
            if (!res.ok) {
                throw data;
            }
            localStorage.setItem("accessToken", data.accessToken); //성공
            localStorage.setItem("refreshToken", data.refreshToken);
            
            setLoginInfo({isSuccess: true, id: inputData.get("id")});
            return;
        } catch (e) {
            if (e.message != undefined) setMessage(e.message)
            setIsFail(true);
        }
    }
    return (
        <form className="login" onLoad={getName} onSubmit={handleSubmit}>
            <img src={logo_img} alt="LOGO" />
            <span className="namespan">{name}</span>
            <input name='id' type="text" placeholder="ID" />
            <input name='password' type="password" placeholder="PW" />
            <div className="buttons">
                <Link to='/register' className="link">회원가입</Link>
                <button className="link" >로그인</button>
            </div>
            <Link to='/login/ask'>로그인에 문제가 있으신가요?</Link>

            {isFail && <ModalOk close={() => setIsFail(false)}>{message}</ModalOk>}
            {isEmpty && <ModalOk close={() => setIsEmpty(false)}>{"입력하지 않은 값이 있습니다."}</ModalOk>}
            {loginInfo.isSuccess && <ModalOk close={afterSuccess}>{"로그인 성공"}</ModalOk>}
        </form>
    )
}