"use client";
import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useAvailablActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState<[]>([])
    const [availableTriggers, setAvailableTriggers] = useState<[]>([])
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/action/available`).then(res => {
            setAvailableActions(res.data.availableActions)
        })
        axios.get(`${BACKEND_URL}/api/v1/trigger/available`).then(res => {
            setAvailableTriggers(res.data.availableTriggers)
        })
    }, [])
    return { availableActions, availableTriggers }
}

export default function () {
    const router = useRouter();
    const { availableActions, availableTriggers } = useAvailablActionsAndTriggers()
    const [selectedTrigger, setSelectedTrigger] = useState<{
        id: string,
        name: string,
    }>();
    const [selectedActions, setSelectedActions] = useState<{
        index: number,
        availableActionId: string,
        availableActionName: string,

    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);
    return <div>
        <Appbar />
        <div className="flex justify-end bg-slate-200 p-4">
            <PrimaryButton onclick={async() => {
                if(!selectedTrigger?.id){
                    return
                }
                const response=await axios.post(`${BACKEND_URL}/api/v1/zap`, {
                    availableTriggerId:selectedTrigger.id,
                    triggerMetaData:{},
                    actions:selectedActions.map(a=>({
                        availableActionId:a.availableActionId,
                        actionMetaData:{},
                    }))
                },{
                    headers:{
                        Authorization:`${localStorage.getItem("token")}`
                    }
                })
                router.push("/dashboard")
            }}>Publish</PrimaryButton>
        </div>
        <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
            <div className="flex justify-center">
                <ZapCell onClick={() => { setSelectedModalIndex(1) }} name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"} index={1} />
            </div>
            <div className="w-full pt-2 pb-2">
                {selectedActions.map((action, index) =>
                    <div className="flex justify-center pt-2" key={index}>
                        <ZapCell onClick={() => { setSelectedModalIndex(action.index) }} name={action.availableActionName ? action.availableActionName : "Action"} index={action.index} />
                    </div>
                )}
            </div>
            <div className="flex justify-center">
                <div>
                    <PrimaryButton onclick={() => {
                        setSelectedActions(a => [...a,

                        { index: a.length + 2, availableActionId: "", availableActionName: "" }
                        ])
                    }} ><div className="text-2xl max-w-2 flex justify-center">+</div>
                    </PrimaryButton>
                </div>
            </div>
        </div>
        {selectedModalIndex && <Modal availableItems={selectedModalIndex == 1 ? availableTriggers : availableActions} onSelect={(props: null | { name: string, id: string }) => {
            if (props == null) {
                setSelectedModalIndex(null)
            }
            else if (selectedModalIndex == 1) {
                setSelectedTrigger({
                    id: props.id,
                    name: props.name
                })
            }
            else {
                setSelectedActions(a => {
                    let newActions = [...a]
                    newActions[selectedModalIndex - 2] = {
                        index: selectedModalIndex,
                        availableActionId: props.id,
                        availableActionName: props.name
                    }
                    return newActions
                })
            }
            setSelectedModalIndex(null)
        }} index={selectedModalIndex} />}
    </div>
}

function Modal({ index, onSelect, availableItems }: { index: number, onSelect: (props: null | { name: string, id: string }) => void, availableItems: { id: string, name: string, image: string }[] }) {
    return <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full  bg-slate-100 bg-opacity-70 flex">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow-sm ">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                    <div className="text-2xl">
                        Select {index == 1 ? "Trigger" : "Action"}
                    </div>
                    <button onClick={() => { onSelect(null) }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                    {availableItems.map(({ id, name, image }) => {
                        return <div className="flex border p-4 cursor-pointer hover:bg-slate-200" key={id} onClick={() => { onSelect({ id, name }) }}>
                            <img src={image} width={30} className="rounded-full" alt="" />
                            <div className="flex flex-col justify-center">{name}</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
    </div>
}    
