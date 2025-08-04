"use client"
import { useRouter } from "next/navigation"
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton"
import { useEffect, useState } from "react"

export const Appbar = () => {
    const router = useRouter()
    const [tokenToLogout, setTokenToLogout] = useState(false)
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setTokenToLogout(true)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("token")
        setTokenToLogout(false)
        router.push("/login")
    }

    return <div className="flex border-b justify-between p-4">
        <div className="flex flex-col justify-center text-2xl font-extrabold">Zapier</div>
        <div className="flex">
            <LinkButton onclick={() => { }}>Contact Sales</LinkButton>
            {!tokenToLogout
                ? (<>
                    <LinkButton onclick={() => { router.push("/login") }}>Log in</LinkButton>
                    <PrimaryButton onclick={() => { router.push("/signup") }}>Sign up</PrimaryButton>
                </>)
                : (
                    <PrimaryButton onclick={handleLogout}>Log out</PrimaryButton>
                )
            }

        </div >
    </div >
}