import { dispatch } from '../../../index'
import Constants from '../../../Constants';

export const onLogin = (currentUser, server) => {
    dispatch({ type: Constants.ReducerActions.SET_USER, currentUser })
    server.publishMessage({type: Constants.ReducerActions.MATCH_AVAILABLE, currentUser})
}

export const onMatchStart = (currentUser, sessionId, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE, 
        sessionId,
        session: {
            status: Constants.MatchStatus.ACTIVE,
            activePlayerId: currentUser.id,
            phase: Constants.Phases.CHOOSE_ROLES
        }
    })
}

export const onChooseRole = (role, currentUser, activeSession, server) => {
    activeSession.players.forEach((player) => { if(player.id === currentUser.id) player.role = role })
    const nextPlayer = activeSession.players.find((player) => !player.role)
    //set next player for current action
    if(nextPlayer) activeSession.activePlayerId = nextPlayer.id
    else{
        //if everyone has a role then move to next phase, which is dictated by the next player's role
        let nextPlayerIndex
        activeSession.players.forEach((player, i) => {if(player.id === activeSession.activePlayerId) nextPlayerIndex = i})
        const nextPlayer = activeSession.players[nextPlayerIndex+1]
        if(!nextPlayer) nextPlayer = activeSession.players[0]
        activeSession.activePlayerId = nextPlayer.id
        activeSession.phase = nextPlayer.role
    }
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
