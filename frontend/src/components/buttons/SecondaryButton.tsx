import { ReactNode } from "react"

export const SecondaryButton = ({ children, onclick, size = "small" }: {
    children: ReactNode,
    onclick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onclick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 pt-2" : "px-10 py-4"} cursor-pointer hover:shadow-md border text-black border-black rounded-full`}>
        {children}
    </div>
}