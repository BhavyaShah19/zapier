"use client"
import { useRouter } from "next/navigation"
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton"

export const Appbar = () => {
    const router = useRouter()
    return <div className="flex border-b justify-between p-4">
        <div className="flex flex-col justify-center text-2xl font-extrabold">Zapier</div>
        <div className="flex">
            <LinkButton onclick={() => { }}>Contact Sales</LinkButton>
            <LinkButton onclick={() => { router.push("/login") }}>Log in</LinkButton>
            <PrimaryButton onclick={() => { router.push("/signup") }}>Sign up</PrimaryButton>
        </div>
    </div>
}