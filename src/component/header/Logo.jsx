import React, { useState } from "react";
import "../../css/header.css"
import logo_img from "../../config/img/logo.png"
import configData from "../../config/config.json"

export default function Logo() {

    const [name, setName] = useState();

    function getName(){
        setName(configData.NAME);
    }

    return (
        <div className="logo" onLoad={getName}>
            <img src={logo_img} alt="LOGO" />
            <span>{name}</span>
        </div>
    )
}