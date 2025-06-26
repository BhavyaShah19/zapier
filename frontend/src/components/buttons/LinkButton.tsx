"use client";

import { ReactNode } from "react"

export const LinkButton = ({ children, onclick }: { children: ReactNode, onclick: () => void }) => {
    return <div className="flex justify-center px-2 py-2 cursor-pointer hover:bg-slate-100 font-light text-sm " onClick={onclick}>
        {children}
    </div>
}