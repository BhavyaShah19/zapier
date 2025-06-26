import { ReactNode } from "react"

export const PrimaryButton = ({ children, onclick, size = "small" }: {
    children: ReactNode,
    onclick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onclick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2" : "px-10 py-4"} cursor-pointer hover:shadow-md bg-custom-amber text-white rounded-full text-center flex justify-center flex-col`}>
        {children}
    </div>
}