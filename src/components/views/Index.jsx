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

    const [tyler, setTyler] = useState({})
    const [rosslan, setRosslan] = useState({})

    useEffect(() => {
        if (isPending)
            return
        setRosslan(data[0])
        setTyler(data[1])
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
            </main>
        </React.Fragment>
    )
}