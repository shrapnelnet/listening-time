import React from "react"
import Button from "@mui/material/Button"
import { Link } from "react-router-dom"
import "../../style/mui-overrides.css"

export default function Navbar() {
    return (
        <nav>
            <div className="logo">
                <p className={"brand"}>listenin&apos; to!</p>
                <sub>yet another shrapnelnet production</sub>
            </div>
            <div className={"inner-margin"}>
                <Button>
                    <Link to={"/"}>Home</Link>
                </Button>
                <Button>
                    <Link to={"/register"}>Register</Link>
                </Button>
            </div>
        </nav>
    )
}