import React, { useEffect, useState } from "react"
import Navbar from "../navigation/Navbar.jsx"
import Button from "@mui/material/Button"
import "../../style/mui-overrides.css"
import { v4 as uuid } from "uuid"

export default function Register() {
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        if (!submitted) {
            return
        }
        const params = new URLSearchParams()
        const client_id = "0689ec44d8614f4aa62820c1ff0fbc07"
        const scope = "user-read-currently-playing user-read-email user-read-recently-played"
        const response_type = "code"
        const redirect_uri = document.location
            .toString()
            .includes("localhost")
            ? "http://localhost:3000/callback" : "https://music.shrapnelnet.co.uk/callback"

        params.set("client_id", client_id)
        params.set("scope", scope)
        params.set("response_type", response_type)
        params.set("redirect_uri", redirect_uri)
        document.location = "https://accounts.spotify.com/authorize?" + params.toString()
    }, [submitted])

    return (
        <React.Fragment>
            <Navbar />
            <main className="container">
                <h1 className="title">Sign in with spotify!</h1>
                <h4>(You should only need to do this once)</h4>
                <Button onClick={() => setSubmitted(true)}>Log in</Button>
            </main>
        </React.Fragment>
    )
}