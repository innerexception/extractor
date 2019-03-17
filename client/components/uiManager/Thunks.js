import { dispatch } from '../../../index'
import Constants from '../../../Constants';

export const onLogin = (currentUser, sessionName, server) => {
    dispatch({ type: Constants.ReducerActions.SET_USER, currentUser })
    server.publishMessage({type: Constants.ReducerActions.MATCH_AVAILABLE, currentUser, sessionName})
}

export const onMatchStart = (sessionName, currentUser, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_START, 
        sessionName, 
        currentUser
    })
}

export const onChoosePhrase = (phrase, sessionName, server) => {
    server.publishMessage({
        type: Constants.ReducerActions.PHRASE_ENTERED,
        phrase,
        sessionName
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
