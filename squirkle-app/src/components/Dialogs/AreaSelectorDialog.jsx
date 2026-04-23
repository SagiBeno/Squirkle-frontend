import { Dialog, Flex, Text, IconButton, ScrollArea } from '@radix-ui/themes'
import GameAreaPanel from '../GameComponents/GameAreaPanel'
import { useState } from 'react'
import { useEffect } from 'react'
import { HiXMark } from 'react-icons/hi2';
import DialogSpinner from '../Spinners/DialogSpinner';

import '../../Modal.css';
import { ResetPlayerCoins } from '../../GameEvents';

export default function AreaSelectorDialog({ user, setDialogState, setOpen, refreshUser }) {

    const [areas, setAreas] = useState([])
    const [purchasedAreas, setPurchasedAreas] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false);

    async function GetAreas() {
        setLoading(true);
        const areasJson = await (await fetch(`https://squirkle-backend.vercel.app/api/get-all-areas/`)).json()
        const purchasedAreasJson = await (await fetch(`https://squirkle-backend.vercel.app/api/get-user-areas/${user.user.uid}`)).json()

        setAreas(areasJson.areas)
        setPurchasedAreas(purchasedAreasJson.ownedAreas)
        setLoading(false);
    }

    async function Refresh() 
    {
        setRefresh(!refresh)
        const refreshedUser = await refreshUser(user)
        ResetPlayerCoins(refreshedUser?.coinCount)
    }

    useEffect(() => {
        GetAreas()
    }, [refresh])

    return (
        <Dialog.Content maxWidth="450px" style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "hidden", minHeight: '200px', maxHeight: '500px' }}>
            <Dialog.Title style={{ marginTop: 15, color: 'white', textTransform: 'uppercase' }}>
                <Flex
                    style={{
                        justifyContent: "space-between"
                    }}
                >
                    <Text size='6' style={{ margin: '0 auto' }}>SELECT A NEW AREA</Text>
                    <IconButton
                        className="button activeButton"
                        onClick={() => {
                            setDialogState(null);
                            setOpen(false);
                        }}
                    >
                        <HiXMark />
                    </IconButton>
                </Flex>
            </Dialog.Title>

            {loading && <DialogSpinner />}

            <ScrollArea type='auto' scrollbars="vertical" style={{ paddingRight: '12px', minHeight: '100px', maxHeight: '190px' }}>
                <Flex direction="column">
                    {
                        areas.map(x => <GameAreaPanel key={x.id} areaData={x} user={user} purchasedAreas={purchasedAreas} refresh={Refresh} />)
                    }
                </Flex>
            </ScrollArea>

        </Dialog.Content>
    )
}
