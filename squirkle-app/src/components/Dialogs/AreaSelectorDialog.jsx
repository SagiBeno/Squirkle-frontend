import { Dialog, Flex, Text, IconButton, ScrollArea } from '@radix-ui/themes'
import GameAreaPanel from '../GameComponents/GameAreaPanel'
import { useState, useEffect } from 'react'
import { HiXMark } from 'react-icons/hi2';
import DialogSpinner from '../Spinners/DialogSpinner';
import '../../Modal.css';
import { ResetPlayerCoins } from '../../GameEvents';

/**
 * @typedef { Object } Area 
 * @property { string } id - Unique identifier of the are
 * @property { string } [name] - Display name of the area
 * @property { number } [price] - Cost of the area
 */

/**
 * Dialog for selecting and purchasing game areas.
 * 
 * Fetches all available areas and the user's purchased areas,
 * and displays them in a selectable list.
 * 
 * Allows refreshing user data and coin count after actions.
 * 
 * @component
 * 
 * @param { Object } props - Component props
 * @param { Object } props.user - Current authenticated user
 * @param { Function } props.setOpen - Controls dialog visibility
 * @param { Function } props.refreshUser - Refresh user data from backend 
 * @param { Function } props.onCloseAutoFocus - Handles focus restoration after close
 * 
 * @returns { JSX.Element } Area selector dialog UI
 */

export default function AreaSelectorDialog({ user, setOpen, refreshUser, toastData, setToastData, onCloseAutoFocus }) {

    const [areas, setAreas] = useState([])
    const [purchasedAreas, setPurchasedAreas] = useState([])
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false);

    /**
     * Fetches all available areas and the user's owned areas.
     * 
     * Updates local state with fetched data.
     */
    async function GetAreas() {
        setLoading(true);
        const areasJson = await (await fetch(`https://squirkle-backend.vercel.app/api/get-all-areas/`)).json()
        const purchasedAreasJson = await (await fetch(`https://squirkle-backend.vercel.app/api/get-user-areas/${user?.user?.uid}`)).json()

        setAreas(areasJson.areas)
        setPurchasedAreas(purchasedAreasJson.ownedAreas)
        setLoading(false);
    }

    /**
     * Refreshes user data and updates coin count.
     * 
     * Also triggers re-fetching of areas.
     */
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
        <Dialog.Content maxWidth="450px" onCloseAutoFocus={onCloseAutoFocus} style={{ padding: 0, borderRadius: 0, boxShadow: "none", backgroundColor: "transparent", overflow: "hidden", minHeight: '50vh' }}>
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
                            setOpen(false);
                        }}
                    >
                        <HiXMark />
                    </IconButton>
                </Flex>
            </Dialog.Title>

            {loading && <DialogSpinner />}

            <ScrollArea type='auto' scrollbars="vertical" style={{ paddingRight: '12px', minHeight: '100px', maxHeight: '50vh' }}>
                <Flex direction="column">
                    {
                        areas.map(x => <GameAreaPanel key={x.id} areaData={x} user={user} purchasedAreas={purchasedAreas} refresh={Refresh} toastData={toastData} setToastData={setToastData} />)
                    }
                </Flex>
            </ScrollArea>

        </Dialog.Content>
    )
}
