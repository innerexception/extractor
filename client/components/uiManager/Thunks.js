import { dispatch } from '../../../index'
import Constants from '../../../Constants';

export const onLogin = (currentUser, sessionId, server) => {
    dispatch({ type: Constants.ReducerActions.SET_USER, currentUser })
    server.publishMessage({type: Constants.ReducerActions.PLAYER_AVAILABLE, currentUser, sessionId})
}

export const onMatchStart = (currentUser, session, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE, 
        sessionId: session.sessionId,
        session: {
            status: Constants.MatchStatus.ACTIVE,
            activePlayerId: currentUser.id,
            phase: Constants.Phases.CHOOSE_ROLES,
            players: session.players.map((player) => {
                return {
                    ...player, 
                    money: 3+session.players.length,
                    vp: 0,
                    resources: [],
                    buildings: Constants.InitialPlayerBuildings,
                    students: Constants.InitialPlayerStudents
                }
            }),
            buildings: Constants.BuildingsPool,
            graduatePool: [
                { type: Constants.GraduateTypes.COMMUNICATIONS, count: 20 },
                { type: Constants.GraduateTypes.ENGLISH, count: 15 },
                { type: Constants.GraduateTypes.COMPSCI, count: 10 },
                { type: Constants.GraduateTypes.LAWYER, count: 10 },
                { type: Constants.GraduateTypes.DOCTOR, count: 5 },
            ]
        }
    })
}

export const onChooseRole = (role, currentUser, activeSession, server) => {
    activeSession.players.forEach((player) => { if(player.id === currentUser.id) player.role = role })
    activeSession.phase = role.name
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onBuild = (building, currentUser, activeSession, server) => {
    let nextPlayerIndex
    activeSession.players.forEach((player, i) => { 
        if(player.id === currentUser.id){
            player.buildings[building.x][building.y] = building
            nextPlayerIndex = i
            player.money -= building.cost
        } 
    })

    activeSession.buildings.forEach((pbuilding) => {if(pbuilding.name === building.name) pbuilding.count--})

    let nextPlayer = activeSession.players[nextPlayerIndex+1]
    if(nextPlayer)  
        activeSession.activePlayerId = nextPlayer.id
    else activeSession.activePlayerId = activeSession.players[0].id

    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onMatchTick = (session, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_TICK,
        sessionName: session.sessionName
    })
}

export const onMatchWon = (session, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_WIN,
        sessionName: session.sessionName
    })
}

export const onMatchLost = (session, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_LOST,
        sessionName: session.sessionName
    })
}

export const onCleanSession = () => {
    dispatch({
        type: Constants.ReducerActions.MATCH_CLEANUP
    })
}
