let gameContext = null
let addedCoins = 0

export function SetGameContext(_gameContext)
{
    gameContext = _gameContext
}

export function OnPlayerGiveCoins(coins)
{
    addedCoins += coins
    gameContext.setCoins(addedCoins)
}