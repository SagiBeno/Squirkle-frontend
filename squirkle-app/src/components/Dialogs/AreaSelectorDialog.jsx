import { Dialog, Flex } from '@radix-ui/themes'
import GameAreaPanel from '../GameComponents/GameAreaPanel'
import { useState } from 'react'
import { useEffect } from 'react'

import '../../Modal.css';

export default function AreaSelectorDialog({ user }) {

    const [areas, setAreas] = useState([])
    const [purchasedAreas, setPurchasedAreas] = useState([])
    const [refresh, setRefresh] = useState(false)

    async function GetAreas() {
        const areasJson = await (await fetch(`https://squirkle-backend.vercel.app/api/get-all-areas/`)).json()
        const purchasedAreasJson = await (await fetch(`https://squirkle-backend.vercel.app/api/get-user-areas/${user.user.uid}`)).json()

        setAreas(areasJson.areas)
        setPurchasedAreas(purchasedAreasJson.ownedAreas)
    }

    function Refresh() {
        setRefresh(!refresh)
    }

    useEffect(() => {
        GetAreas()
    }, [refresh])

    return (
        <Dialog.Content maxWidth="450px" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "auto" }}>
            <Dialog.Title style={{ textAlign: "center", marginTop: 15, color: "white" }}>SELECT A NEW AREA</Dialog.Title>

            <Flex direction="column" style={{ maxHeight: 300, overflowY: "scroll", scrollSnapType: "y mandatory" }}>
                {
                    areas.map(x => <GameAreaPanel key={x.id} areaData={x} user={user} purchasedAreas={purchasedAreas} refresh={Refresh} />)
                }
            </Flex>
        </Dialog.Content>
    )
}
