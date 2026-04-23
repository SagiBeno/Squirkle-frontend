let setCoins = null
let baseCoins = 0
let addedCoins = 0

export function SetGameContext(_gameContext)
{
    setCoins = _gameContext?.setCoins ?? null
    setCoins(baseCoins + addedCoins)
}

export function OnPlayerGiveCoins(coins)
{
    if (setCoins == null) return

    addedCoins += Number(coins)   
    setCoins(baseCoins + addedCoins)
}

export function ResetPlayerCoins(coins = baseCoins)
{
    if (setCoins == null) return

    baseCoins = Number(coins)
    addedCoins = 0
    setCoins(baseCoins)
}
