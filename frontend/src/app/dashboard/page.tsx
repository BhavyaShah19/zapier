"use client";
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BACKEND_URL, HOOKS_URL } from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";

interface Zap {
    id: string,
    triggerId: string,
    userId: string,
    actions: {
        id: string,
        zapId: string,
        actionId: string,
        sortingOrder: number,
        type: {
            id: string,
            name: string,
            image: string
        }
    }[],
    trigger: {
        id: string,
        zapId: string,
        triggerId: string,
        type: {
            id: string,
            name: string,
            image: string
        }
    }

}
function useZaps() {
    const [zaps, setZaps] = useState<Zap[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/zap`, {
            headers: {
                Authorization: `${localStorage.getItem("token")}`
            }
        }).then(res => {
            setZaps(res.data.zaps)
            setLoading(false)
        })
    }, [])
    return { zaps, loading }
}

export default function () {
    console.log("I am here in dashboard")
    const router = useRouter();
    const { zaps, loading } = useZaps()
    return <div>
        <Appbar />
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zap/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZapTable zaps={zaps} /> </div>}
    </div>
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
    const router = useRouter();
    return <div className="p-8 max-w-screen-lg w-full">
        <div className="flex m-5">
            <div className="flex-1">Name</div>
            <div className="flex-1">ID</div>
            <div className="flex-1">Created at</div>
            <div className="flex-1">Webhook URL</div>
            <div className="flex-1">Go</div>
        </div>
        {zaps.map(z =>
            <div key={z.id} className="flex border-b border-t py-4">
                <div className="flex-1 flex">
                    <img src={z.trigger.type.image} className="w-[30px] h-[30px]" />
                    {z.actions.map(x => <img src={x.type.image} className="w-[30px] h-[30px]" />)} 
                </div>
                <div className="flex-1">{z.id}</div>
                <div className="flex-1">Nov 13, 2023</div>
                <div className="flex-1">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
                <div className="flex-1"><LinkButton onclick={() => {
                    router.push("/zap/" + z.id)
                }}>Go</LinkButton></div>
            </div>
        )}
    </div>
}