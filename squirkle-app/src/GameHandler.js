const JSBridge = "JSBridge"
let sendMessage = null

export function InitializeGameHandler(_sendMessage)
{
    sendMessage = _sendMessage
}

/////////////////////////////////////////////////////////////////

export function EquipWeapon(weapon)
{
    console.log(`Equipping weapon: ${JSON.stringify(weapon)}`)
    sendMessage(JSBridge, "SetPlayerWeapon", JSON.stringify(weapon))
}

export function LoadArea(areaID)
{
    sendMessage(JSBridge, "LoadArea", areaID)
}

export async function InitializeGame(user)
{
    if (user == null) return

    await SetGameTime()
    
    const equippedItems = await (await fetch(`https://squirkle-backend.vercel.app/api/get-equipped-items/${user.user.uid}`)).json()
    const equippedItemData = {}

    for (let i = 0; i < equippedItems.items.length; i++) 
    {
        const item = await (await fetch(`https://squirkle-backend.vercel.app/api/get-item/${equippedItems.items[i].baseItemId}`)).json()
        equippedItemData[item.item.type] = item.item
    }

    const initData = JSON.stringify({
        userId: user.user.uid,
        equippedItems: equippedItemData
    })

    console.log(initData)

    sendMessage(JSBridge, "GameInitialize", initData)
}

export async function SetGameTime()
{
    let time = await (await fetch("https://squirkle-backend.vercel.app/api/server-time")).json()
    sendMessage(JSBridge, "SetGameTime", time.serverTime)
}