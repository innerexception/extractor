import { dispatch } from '../../../client/App'
const Constants = require('../../../Constants')
import { toast } from './toast'
import WS from '../../WebsocketClient'
export const server = new WS()
import { Phases, GraduateTypes, Boards, MatchStatus } from '../../../enum'
import { getTeachersForPosition, getProductionCount,
         getGradValue, getInitialTiles, prepareNextPlayer, getRandomTile } from '../uiManager/Helpers'

export const onLogin = (currentUser:LocalUser, sessionId:string) => {
    dispatch({ type: Constants.ReducerActions.SET_USER, currentUser })
    server.publishMessage({type: Constants.ReducerActions.PLAYER_AVAILABLE, currentUser, sessionId})
}

export const onMatchStart = (currentUser:LocalUser, session:Session) => {
    server.publishMessage({
        type: Constants.ReducerActions.MATCH_UPDATE, 
        sessionId: session.sessionId,
        session: {
            status: Constants.MatchStatus.ACTIVE,
            activePlayerId: currentUser.id,
            bossId: currentUser.id,
            phase: Phases.CHOOSE_ROLES,
            players: session.players.map((player:Player, i:number) => {
                return {
                    ...player, 
                    money: 3+session.players.length,
                    vp: 0,
                    graduates: [],
                    buildings:  Constants.InitialPlayerBuildings,
                    highSchools:  Constants.InitialPlayerStudents,
                    teachers: [],
                    turn: i,
                    tilePlacements: 1,
                    role: null
                }
            }),
            buildings: Constants.BuildingsPool,
            highSchools: getInitialTiles(),
            quarries: 6,
            fundraising: [],
            graduatePool: {
                [GraduateTypes.COMMUNICATIONS]: 20,
                [GraduateTypes.ENGLISH]: 15,
                [GraduateTypes.COMPSCI]: 10,
                [GraduateTypes.LAWYER]: 10,
                [GraduateTypes.DOCTOR]: 5
            },
            hiringPool: session.players.length+1,
            teacherPool: 55,
            roles: Constants.InitialRoles
        }
    })
    toast.show({message: 'Match was begun.'})
}

export const onChooseRole = (role:Role, currentUser:LocalUser, activeSession:Session) => {
    activeSession.players.forEach((player) => { if(player.id === currentUser.id) player.role = role })
    activeSession.phase = role.phase

    activeSession.roles.forEach((role:Role) => {if(role.name === role.name) role.picked=true})
    
    if(role.phase === Phases.RECRUIT_TEACHERS){
        let emptySpots = 0, amount =0
        activeSession.players.forEach((player:Player) => {
            amount = Math.round(activeSession.hiringPool/activeSession.players.length)
            player.teachers = player.teachers.concat(new Array(amount).fill(null)
                .map((teacher:Teacher) => ({
                    id: Date.now() + '' + Math.random(),
                    x: null,
                    y: null,
                    board:null
                })))
            player.buildings.forEach((row:Array<Building>, i:number) => {
                row.forEach((building,j) => {
                    if(building){
                        let present = getTeachersForPosition(i,j,player.teachers,Boards.Campus).length
                        emptySpots += building.capacity - present
                    }
                })
            })
        })
        
        toast.show({message: 'Distributed '+amount+' teachers to all players. Place them now.'})

        //refill hiring pool
        let refill = Math.max(emptySpots, activeSession.players.length)
        activeSession.hiringPool = refill
        activeSession.teacherPool -= refill
    }

    if(role.phase === Phases.COLLECT_INTEREST){
        let nextPlayerIndex=0, nextPlayer
        activeSession.players.forEach((player) => {
            if(player.id === currentUser.id){
                player.money++
                nextPlayerIndex=player.turn
            }
        })
        
        //choose new role
        activeSession.phase = Phases.CHOOSE_ROLES
        //set boss to next player
        nextPlayer = activeSession.players[(nextPlayerIndex+1)%(activeSession.players.length)]
        activeSession.bossId = nextPlayer.id
        activeSession.activePlayerId = nextPlayer.id
        //if all players have a chosen role, reset roles and put cash on unused ones
        let emptyRole = activeSession.players.find((player:Player) => !player.role)
        if(!emptyRole){
            activeSession.players.forEach((player:Player) => player.role = null)
            activeSession.roles.forEach((role:Role) => {if(!role.picked) role.money++; role.picked=false})
        }

        toast.show({message: 'You collected $1 in interest.'})
    }

    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })

}

export const onSellGraduate = (graduate:Graduate, currentUser:LocalUser, activeSession:Session) => {
    activeSession.fundraising.push(graduate)
    if(activeSession.fundraising.length >=4){
        //put these back in the graduate pool
        activeSession.fundraising.forEach((graduate:Graduate) => {
            (activeSession.graduatePool as any)[graduate.type]++
        })
        activeSession.fundraising = []
    }
    let nextPlayerIndex
    activeSession.players.forEach((player:Player) => { 
        if(player.id === currentUser.id){
            nextPlayerIndex = player.turn
            player.money += graduate.value
            player.graduates = player.graduates.filter((pgraduate:Graduate) => graduate.id !== pgraduate.id)
        } 
    })
    activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)
    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })

    toast.show({message: 'You got a graduate to give $'+graduate.value+'!'})
}

export const onProduceGraduates = (graduateType:GraduateTypes, currentUser:LocalUser, activeSession:Session) => {
    activeSession.players.forEach((player:Player) => {
        if(player.id === currentUser.id){
            let amountProduced = getProductionCount(player, graduateType)
            
            const grads = new Array<Graduate>(amountProduced).fill({
                id: Date.now()+''+Math.random(),
                type: graduateType,
                value: getGradValue(graduateType)
            })
            //then produce a graduate.
            player.graduates = player.graduates.concat(grads)

            activeSession = prepareNextPlayer(activeSession, player.turn)

            server.publishMessage({
                type:   Constants.ReducerActions.MATCH_UPDATE,
                session: activeSession,
                sessionId: activeSession.sessionId
            })

            toast.show({message: 'Produced '+grads.length+' '+graduateType+' graduates'})
        }
    })
}

export const onBuild = (x:number, y:number, building:Building, currentUser:LocalUser, activeSession:Session) => {
    let nextPlayerIndex
    activeSession.players.forEach((player:Player) => { 
        if(player.id === currentUser.id){
            player.buildings[x][y] = {...building}
            nextPlayerIndex = player.turn
            player.money -= building.cost
        } 
    })

    activeSession.buildings.forEach((pbuilding:Building) => {if(pbuilding.name === building.name) pbuilding.count--})

    activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)

    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })

    toast.show({message: 'You built a '+building.name})
}

export const onPlaceTeacher = (teacher:Teacher, board:Boards, x:number, y:number, currentUser:LocalUser, activeSession:Session) => {
    activeSession.players.forEach((player) => {
        if(player.id === currentUser.id){
            player.teachers.forEach((pteacher) => {
                if(teacher.id === pteacher.id){
                    if(player.buildings[x][y]){
                        if(getTeachersForPosition(x,y,player.teachers, board).length<player.buildings[x][y].capacity){
                            pteacher.x = x
                            pteacher.y = y
                            pteacher.board = board
                            toast.show({message: 'Teacher Placed.'})
                        }
                        else toast.show({message: 'Space is full!'})
                    }
                    else {
                        pteacher.x = x
                        pteacher.y = y
                        pteacher.board = board
                        toast.show({message: 'Teacher Placed.'})
                    }
                }
            })
        }
    })

    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })

}

export const onTilePlaced = (tileType:GraduateTypes, x:number, y:number, currentUser:LocalUser, activeSession:Session) => {
    let nextPlayerIndex, setNextPlayer
    activeSession.players.forEach((player) => {
        if(player.id === currentUser.id){
            player.highSchools[x][y]={   
                type: tileType
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
    activeSession.highSchools[Math.floor(Math.random()*activeSession.highSchools.length)] = getRandomTile()

    //If a quarry was picked, subtract from session total
    if(tileType === 'quarry')
        activeSession.quarries--

    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })

    toast.show({message: tileType+' high school has been recruited.'})
}

export const onEndTurn = (currentUser:LocalUser, activeSession:Session) => {
    let nextPlayerIndex
    activeSession.players.forEach((player) => {
        if(player.id === currentUser.id){
            nextPlayerIndex = player.turn
        }
    })

    activeSession = prepareNextPlayer(activeSession, nextPlayerIndex)

    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        session: activeSession,
        sessionId: activeSession.sessionId
    })

    toast.show({message: 'You ended your turn.'})
}

export const onMatchTick = (session:Session) => {
    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        sessionId: session.sessionId
    })
}

export const onMatchWon = (session:Session) => {
    session.status = MatchStatus.WIN
    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        sessionId: session.sessionId
    })
}

export const onMatchLost = (session:Session) => {
    session.status = MatchStatus.LOSE
    server.publishMessage({
        type:   Constants.ReducerActions.MATCH_UPDATE,
        sessionId: session.sessionId
    })
}

export const onCleanSession = () => {
    dispatch({
        type:   Constants.ReducerActions.MATCH_CLEANUP
    })
}