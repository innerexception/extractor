declare enum GraduateTypes {
    COMMUNICATIONS='com',ENGLISH='eng',COMPSCI='sci',LAWYER='law',DOCTOR='dr',TRADES='quarry'
}
declare enum Boards {Campus='campus',HighSchools='hs'}
declare enum MatchStatus {ACTIVE='ACTIVE',WIN='WIN',LOSE='LOSE'}
declare enum Phases {
    CHOOSE_ROLES='CHOOSE_ROLES',
    BUILD='BUILD',
    RECRUIT_TEACHERS='RECRUIT_TEACHERS',
    RECRUIT_STUDENTS='RECRUIT_STUDENTS',
    FUNDRAISE='FUNDRAISE',
    PRODUCE='PRODUCE',
    PLACE_GRADUATES='PLACE_GRADUATES',
    COLLECT_INTEREST='COLLECT_INTEREST'
}

interface LocalUser {
    name:string
    id:string
}

interface Teacher {
    id: string
    x:number
    y:number
    board:Boards
}

interface Player {
    name: string
    id: string
    money: number,
    vp: number,
    graduates: Array<Graduate>,
    buildings: Array<Array<Building>>,
    highSchools:  Array<Array<HighSchool>>,
    teachers: Array<Teacher>,
    turn: number,
    tilePlacements: number,
    role:Role
}

interface Graduate {
    id:string
    value: number,
    type: GraduateTypes
}

interface Building {
    name: string
    count: number
    cost: number
    capacity: number
}

interface HighSchool {
    type: string
}

interface Role {
    phase: Phases
    money: number
    name: string
    actionDescription: string
    bonusDescription: string
}

interface Session {
    sessionId: string,
    status: MatchStatus,
    activePlayerId: string,
    bossId: string,
    phase: Phases,
    players: Array<Player>
    buildings: Array<Building>
    highSchools: Array<GraduateTypes>
    quarries: number
    fundraising: Array<Graduate>
    graduatePool: {
        [GraduateTypes.COMMUNICATIONS]: 20,
        [GraduateTypes.ENGLISH]: 15,
        [GraduateTypes.COMPSCI]: 10,
        [GraduateTypes.LAWYER]: 10,
        [GraduateTypes.DOCTOR]: 5
    },
    hiringPool: number,
    teacherPool: number,
    roles: Array<Role>,
    ticks: number,
    turnTickLimit: number
}

interface RState {
    isConnected: boolean
    currentUser: LocalUser
    activeSession: {
        players: Array<Player>
    }
}