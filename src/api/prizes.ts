import {useQuery} from "@tanstack/react-query";
import {api} from "./api.ts";

export const usePrizes = ()=>{
    return useQuery({
        queryKey:['prizes'],
        queryFn:async ()=>{
            const response = await api.get('/user/prize')
            return response.data
        }
    })
}