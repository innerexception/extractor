import { Phases, GraduateTypes, Boards, Buildings } from '../../../enum'

export const getProductionCount = (player:Player, graduateType:GraduateTypes) => {
    let amountProduced = 0, highschoolsOfType=0, teachersOfType=0

    player.highSchools.forEach((row) => row.forEach((highSchool:HighSchool) => {
        if(highSchool && highSchool.type === graduateType) highschoolsOfType++
    }))

    if(graduateType === GraduateTypes.COMMUNICATIONS){
        amountProduced += highschoolsOfType
    }
    else {
        player.buildings.forEach((row, i) => row.forEach((building:Building, j) => {
            if(building){
                let teachers = getTeachersForPosition(i,j,player.teachers,Boards.Campus)
                switch(graduateType){
                    case GraduateTypes.ENGLISH: 
                        switch(building.id){
                            case Buildings.ENGLISH_DEPT_S:
                                teachersOfType+= teachers.length
                                break
                            case Buildings.ENGLISH_DEPT_L: 
                                teachersOfType+= teachers.length
                                break
                        }
                        break
                    case GraduateTypes.COMPSCI: 
                        switch(building.id){
                            case Buildings.COMP_SCI_S:
                                teachersOfType+= teachers.length
                                break
                            case Buildings.COMP_SCI_L: 
                                teachersOfType+= teachers.length
                                break
                        }
                        break
                    case GraduateTypes.DOCTOR: 
                        switch(building.id){
                            case Buildings.MED:
                                teachersOfType+= teachers.length
                                break
                        }
                        break
                    case GraduateTypes.LAWYER: 
                        switch(building.id){
                            case Buildings.LAW:
                                teachersOfType+= teachers.length
                                break
                        }
                        break
                }
            }
        }))
    }
    return Math.min(amountProduced, teachersOfType)
}

export const getTeachersForPosition = (x:number,y:number, teachers:Array<Teacher>, board:Boards) => teachers.filter((teacher:Teacher) => teacher.x === x && teacher.y === y && teacher.board === board)


export const prepareNextPlayer = (activeSession:Session, nextPlayerIndex:number) => {
    let nextPlayer = activeSession.players[(nextPlayerIndex+1)%(activeSession.players.length)]
    activeSession.activePlayerId = nextPlayer.id

    if(activeSession.activePlayerId === activeSession.bossId){
        //choose new role
        activeSession.phase = Phases.CHOOSE_ROLES
        //set boss to next player
        nextPlayer = activeSession.players[(nextPlayerIndex+2)%(activeSession.players.length)]
        activeSession.bossId = nextPlayer.id
        activeSession.activePlayerId = nextPlayer.id
        //if all players have a chosen role, reset roles and put cash on unused ones
        let emptyRole = activeSession.players.find((player:Player) => !player.role)
        if(!emptyRole){
            activeSession.players.forEach((player:Player) => player.role = null)
            activeSession.roles.forEach((role:Role) => {if(!role.picked) role.money++; role.picked=false})
        }
    }
    return activeSession
}

export const getInitialTiles = () => {
    return new Array(4).fill(null).map((tile) => {
        return getRandomTile()
    })
}

export const getRandomTile = () => {
    let types = Object.keys(GraduateTypes)
    return GraduateTypes[types[Math.floor(Math.random()*types.length-1)] as any] as GraduateTypes
}

export const getGradValue = (type:GraduateTypes) => {
    switch(type){
        case GraduateTypes.COMMUNICATIONS: return 0
        case GraduateTypes.ENGLISH: return 1
        case GraduateTypes.COMPSCI: return 2
        case GraduateTypes.LAWYER: return 3
        case GraduateTypes.DOCTOR: return 4
        default: return 0
    }
}