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
            bossId: currentUser.id,
            phase: Constants.Phases.CHOOSE_ROLES,
            players: session.players.map((player, i) => {
                return {
                    ...player, 
                    money: 3+session.players.length,
                    vp: 0,
                    graduates: [],
                    buildings: Constants.InitialPlayerBuildings,
                    students: Constants.InitialPlayerStudents,
                    teachers: [],
                    turn: i,
                    tilePlacements: 1
                }
            }),
            buildings: Constants.BuildingsPool,
            tiles: getInitialTiles(),
            quarries: 6,
            fundraising: [],
            graduatePool: {
                [Constants.GraduateTypes.COMMUNICATIONS]: 20,
                [Constants.GraduateTypes.ENGLISH]: 15,
                [Constants.GraduateTypes.COMPSCI]: 10,
                [Constants.GraduateTypes.LAWYER]: 10,
                [Constants.GraduateTypes.DOCTOR]: 5
            },
            hiringPool: session.players.length+1,
            teacherPool: 55,
            roles: []
        }
    })
}

export const onChooseRole = (role, currentUser, activeSession, server) => {
    activeSession.players.forEach((player) => { if(player.id === currentUser.id) player.role = role })
    activeSession.phase = role.name

    if(role.name === Constants.Phases.RECRUIT_TEACHERS){
        activeSession.players.forEach((player) => {
            player.teachers = player.teachers.concat(new Array(Math.round(activeSession.hiringPool/activeSession.players.length)).fill()
                .map((teacher) => ({
                    id: Date.now() + '' + Math.random()
                })))
        })
    }

    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onSellGraduate = (graduate, currentUser, activeSession, server) => {
    activeSession.fundraising.push(graduate)
    if(activeSession.fundraising.length >=4){
        //put these back in the graduate pool
        activeSession.fundraising.forEach((graduate) => {
            activeSession.graduatePool[graduate.type]++
        })
        activeSession.fundraising = []
    }
    let nextPlayerIndex
    activeSession.players.forEach((player) => { 
        if(player.id === currentUser.id){
            player.buildings[building.x][building.y] = building
            nextPlayerIndex = player.turn
            player.money += graduate.value
            player.graduates = player.graduates.filter((pgraduate) => graduate.id !== pgraduate.id)
        } 
    })
    activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onBuild = (building, currentUser, activeSession, server) => {
    let nextPlayerIndex
    activeSession.players.forEach((player) => { 
        if(player.id === currentUser.id){
            player.buildings[building.x][building.y] = building
            nextPlayerIndex = player.turn
            player.money -= building.cost
        } 
    })

    activeSession.buildings.forEach((pbuilding) => {if(pbuilding.name === building.name) pbuilding.count--})

    activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)

    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onPlaceTeacher = (teacher, board, x, y, currentUser, activeSession, server) => {
    activeSession.players.forEach((player) => {
        if(player.id === currentUser.id){
            player.teachers.forEach((pteacher) => {
                if(teacher.id === pteacher.id){
                    pteacher.x = x
                    pteacher.y = y
                    pteacher.board = board
                }
            })
        }
    })

    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onTilePlaced = (tile, x, y, currentUser, activeSession, server) => {
    let nextPlayerIndex, setNextPlayer
    activeSession.players.forEach((player) => {
        if(player.id === currentUser.id){
            player.students[x][y]={   
                type: tile
            }
            nextPlayerIndex = player.turn
            player.tilePlacements--;
            if(player.tilePlacements <= 0){
                setNextPlayer = true
                player.tilePlacements = 1 //todo check for building upgrade
            }
        }
    })

    if(setNextPlayer){
        activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)
    }

    //Randomize 1 of the session tiles
    activeSession.tiles[Math.floor(Math.random()*activeSession.tiles.length)] = getRandomTile()

    //If a quarry was picked, subtract from session total
    if(tile === 'quarry')
        activeSession.quarries--

    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })
}

export const onEndTurn = (currentUser, activeSession, server) => {
    let nextPlayerIndex
    activeSession.players.forEach((player) => {
        if(player.id === currentUser.id){
            nextPlayerIndex = player.turn
        }
    })

    activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)

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

const prepareNextPlayer = (activeSession, nextPlayerIndex) => {
    let nextPlayer = activeSession.players[(nextPlayerIndex+1)%(activeSession.players.length)]
    activeSession.activePlayerId = nextPlayer.id

    if(activeSession.activePlayerId === activeSession.bossId){
        //choose new role
        activeSession.phase = Constants.Phases.CHOOSE_ROLES
        //set boss to next player
        nextPlayer = activeSession.players[(nextPlayerIndex+2)%(activeSession.players.length)]
        activeSession.bossId = nextPlayer.id
        activeSession.activePlayerId = nextPlayer.id
        //if all players have a chosen role, reset roles and put cash on unused ones
        let emptyRole = activeSession.players.find((player) => !player.role)
        if(!emptyRole){
            activeSession.players.forEach((player) => player.role = null)
            //TODO
            activeSession.roles.forEach((role) => {if(!role.picked) role.money++})
        }
    }
    return activeSession
}

const getInitialTiles = () => {
    return new Array(4).fill().map((tile) => {
        return getRandomTile()
    })
}

export const getRandomTile = () => {
    let types = Object.keys(Constants.GraduateTypes)
    return Constants.GraduateTypes[types[Math.floor(Math.random()*types.length)]]
}