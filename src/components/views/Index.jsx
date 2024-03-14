import React, { useEffect, useState } from "react"
import Navbar from "../navigation/Navbar.jsx"
import "../../style/Index.jsx.css"
import { useQuery } from "@tanstack/react-query"

export default function Index() {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ["songs"],
        queryFn: () => {
            return fetch("https://currently-playing.shrapnelnet.workers.dev")
                .then((res) => res.json())
        }
    })

    const placeholder = {
        cover: "/sadmac.png",
        artist: "loading...",
        name: "loading..."
    }

    const [tyler, setTyler] = useState(placeholder)
    const [rosslan, setRosslan] = useState(placeholder)
    const [sam, setSam] = useState(placeholder)
    const [moon, setMoon] = useState(placeholder)
    const [emma, setEmma] = useState(placeholder)
    const [river, setRiver] = useState(placeholder)

    useEffect(() => {
        if (isPending)
            return
        setRosslan(data[0])
        setTyler(data[1])
        setSam(data[2])
        setMoon(data[3])
        setEmma(data[4])
        setRiver(data[5])
    }, [isPending])

    return (
        <React.Fragment>
            <Navbar />
            <main className="container">
                <h1 className="title">The roster:</h1>
                <h3>check out what we're listening to!</h3>
                <p>Rosslan:</p>
                <img src={rosslan.cover} alt="rosslans album cover"/>
                <p>{rosslan.name}</p>
                <sub>by {rosslan.artist}</sub>
                <p>Tyler:</p>
                <img src={tyler.cover} alt="tylers album cover"/>
                <p>{tyler.name}</p>
                <sub>by {tyler.artist}</sub>
                <p>Sam:</p>
                <img src={sam.cover} alt="rosslans album cover"/>
                <p>{sam.name}</p>
                <sub>by {sam.artist}</sub>
                <p>Moon:</p>
                <img src={moon.cover} alt="rosslans album cover"/>
                <p>{moon.name}</p>
                <sub>by {moon.artist}</sub>
                <p>Emma:</p>
                <img src={emma.cover} alt="emma album cover"/>
                <p>{emma.name}</p>
                <sub>by {emma.artist}</sub>
                <p>River:</p>
                <img src={river.cover} alt="river album cover"/>
                <p>{river.name}</p>
                <sub>by {river.artist}</sub>
            </main>
        </React.Fragment>
    )
}