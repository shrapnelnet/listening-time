import React from "react"
import { useNavigate } from "react-router-dom"

export default function Callback() {
    const nav = useNavigate()

    let authorization_code = new URLSearchParams(document.location.search)
    authorization_code = authorization_code.get("code")
    fetch("https://start-callback.shrapnelnet.workers.dev", {
        method: "POST",
        body: JSON.stringify({
            code: authorization_code
        })
    })
        .then(() => {
            nav("/")
        })
    return (
        <React.Fragment>

        </React.Fragment>
    )
}