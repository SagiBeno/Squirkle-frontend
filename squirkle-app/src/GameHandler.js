const JSBridge = "JSBridge"
let sendMessage = null

export function InitializeGameHandler(_sendMessage)
{
    sendMessage = _sendMessage
}

/////////////////////////////////////////////////////////////////

export function EquipWeapon(weapon)
{
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
    sendMessage(JSBridge, "GameInitialize", JSON.stringify({
        userId: user.user.uid
    }))
}

export async function SetGameTime()
{
    let time = await (await fetch("https://squirkle-backend.vercel.app/api/server-time")).json()
    sendMessage(JSBridge, "SetGameTime", time.serverTime)
}