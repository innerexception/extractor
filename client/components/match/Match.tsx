import * as React from 'react'
import { onMatchTick, onPlaceTeacher, onEndTurn, onSellGraduate, onProduceGraduates, onChooseRole } from '../uiManager/Thunks'
import { Card, Dialog, Tooltip, Position, Icon, Radio, RadioGroup, Popover } from '@blueprintjs/core'
import { Phases } from '../../../enum'
import { getProductionCount } from '../uiManager/Helpers'
import Campus from './Campus'
import HighSchools from './HighSchools'
import AppStyles from '../../AppStyles';
import { toast } from '../uiManager/toast'
import { TopBar, LightButton, Button } from '../Shared'

interface Props {
    currentUser: LocalUser
    activeSession: Session
}

interface State {
    interval: NodeJS.Timeout | number
    draggingTeacher: Teacher | null
    sellingGraduate: Graduate | null
    showFundraising: boolean
    showJobSlots: boolean
    showBuildings: boolean
    showGraduatePool: boolean
    showChooseRoles: boolean
    showStudentTiles: boolean
}

export default class Match extends React.Component<Props, State> {

    state = {
        interval: 0,
        draggingTeacher: null as null,
        sellingGraduate: null as null,
        showFundraising: false,
        showJobSlots:false,
        showBuildings: false,
        showGraduatePool: false,
        showChooseRoles: false,
        showStudentTiles: false
    }

    componentDidMount = () => {
        // this.setState({interval: this.props.activeSession.activePlayerId === this.props.currentUser.id ? setInterval(()=>this.checkTimer(), 1000) : 0})
    }

    dropTeacher = (board:Boards, x:number, y:number) => {
        if(this.state.draggingTeacher){
            onPlaceTeacher(this.state.draggingTeacher, board, x, y, this.props.currentUser, this.props.activeSession)
            this.setState({draggingTeacher: null})
        }
    }

    onProduce = (graduateType:GraduateTypes) => {
        if((this.props.activeSession.graduatePool as any)[graduateType] <= 0){
            toast.show({message: 'No graduates of this type left.'})
            return
        }
        onProduceGraduates(graduateType, this.props.currentUser, this.props.activeSession)
    }

    onSellGraduate = () => {
        if(this.state.sellingGraduate !== null){
            if(this.props.activeSession.fundraising.find((graduate) => graduate.type === (this.state.sellingGraduate as Graduate).type)){
                toast.show({message: "Can't shakedown more than 1 grad of the same type."})
                //TODO add building check for selling
            }
            else {
                onSellGraduate(this.state.sellingGraduate, this.props.currentUser, this.props.activeSession)
            }
            this.setState({sellingGraduate:null, showFundraising: false})
        }
    }

    endTurn = () => {
        clearInterval(this.state.interval)
        onEndTurn(this.props.currentUser, this.props.activeSession)
    }

    checkTimer = () => {
        if(this.props.activeSession.ticks >= this.props.activeSession.turnTickLimit){
            this.endTurn()
        }
        else onMatchTick(this.props.activeSession)
    }

    roleNotPicked = (role:Role) => {
        const pickedRoles = this.props.activeSession.players.map((player) => player.role).filter((role) => role)
        return !pickedRoles.find((prole) => prole.name === role.name)
    }

    render(){

        const activePlayer = this.props.activeSession.players.find((player) => player.id === this.props.activeSession.activePlayerId)
        const me = this.props.activeSession.players.find((player) => this.props.currentUser.id === player.id)

        return (
            <div style={styles.frame} onMouseUp={()=>this.setState({draggingTeacher:null})}>
                {TopBar('MacAdmins')}
                <div style={{padding:'0.5em'}}>
                    <div style={{display:'flex', justifyContent:'space-around'}}>
                        {activePlayer.id !== me.id && 
                        <div style={styles.roleCard}>
                            <h4>{activePlayer.name+' is currently ' + activePlayer.role.name}</h4>
                            <hr/>
                            <h5>{activePlayer.role.actionDescription}</h5>
                            <h5>{activePlayer.role.bonusDescription}</h5>
                        </div>}
                        {me.role ? 
                        <div style={styles.roleCard}>
                            <h4>You are {me.role.name}</h4>
                            <hr/>
                            <h5>{me.role.actionDescription}</h5>
                            <h5>{me.role.bonusDescription}</h5>
                        </div> : 
                        <div><h4>You haven't picked yet</h4></div>}
                        <div>
                            <h5>VP {me.vp}</h5>
                            <h5>$ {me.money}</h5>
                            <h6>Graduates: </h6>
                            {me.graduates.map((graduate) => 
                                <div style={this.props.activeSession.phase === Phases.FUNDRAISE ? AppStyles.flex : AppStyles.disabledSection}>
                                    <div style={(AppStyles.highSchoolTile as any)[graduate.type]} onClick={()=>this.setState({sellingGraduate: graduate, showFundraising: true})}/>
                                    <h5>{graduate.type} : {me.graduates.filter((mgraduate) => mgraduate.type === graduate.type).length}</h5>
                                </div>)}
                            <h6>Unassigned Teachers:</h6>
                            <div style={this.props.activeSession.phase === Phases.RECRUIT_TEACHERS && activePlayer.id === me.id ? AppStyles.flex : AppStyles.disabledSection}>
                                {me.teachers.filter((teacher)=>!teacher.board).map((teacher) => 
                                    <div style={AppStyles.teacher} onMouseDown={()=>this.setState({draggingTeacher: teacher})}/>)}
                            </div>
                        </div>
                    </div>
                    <div style={styles.board}>
                        <Campus player={me} 
                                activeSession={this.props.activeSession}
                                onTeacherSelected={(teacher:Teacher)=>this.setState({draggingTeacher: teacher})}
                                onDropTeacher={(board:Boards, x:number, y:number)=>this.dropTeacher(board, x, y)}
                                showBuildings={this.state.showBuildings}
                                isActive={(this.props.activeSession.phase === Phases.BUILD || this.props.activeSession.phase === Phases.RECRUIT_TEACHERS) && activePlayer.id === me.id}/>
                        <HighSchools player={me} 
                                    activeSession={this.props.activeSession}
                                    onTeacherSelected={(teacher:Teacher)=>this.setState({draggingTeacher: teacher})}
                                    onDropTeacher={(board:Boards, x:number, y:number)=>this.dropTeacher(board, x, y)}
                                    isActive={(this.props.activeSession.phase === Phases.RECRUIT_STUDENTS || this.props.activeSession.phase === Phases.RECRUIT_TEACHERS) && activePlayer.id === me.id}/>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', padding:'0.5em'}}>
                        {LightButton(true, ()=>this.setState({showJobSlots: !this.state.showJobSlots}), 'Industry Job Slots')}
                        {LightButton(true, ()=>this.setState({showBuildings: !this.state.showBuildings}), 'Buildings')}
                        {LightButton(true, ()=>this.setState({showGraduatePool: !this.state.showGraduatePool}), 'Graduate Pool')}
                        {LightButton(true, ()=>this.setState({showStudentTiles: !this.state.showStudentTiles}), 'High Schools')}
                        {LightButton(true, ()=>this.setState({showFundraising: !this.state.showFundraising}), 'Fundraisers')}
                        {Button(true, this.endTurn, 'End Turn')}
                    </div>
                </div>
                <div style={{...styles.modal, display: this.state.showChooseRoles || this.props.activeSession.phase === Phases.CHOOSE_ROLES ? 'flex':'none'}}>
                    {TopBar('Choose Roles')}
                    <div style={{display:'flex', height:'calc(100% - 1em)', flexDirection:'column', alignItems:'center'}}>
                        <div style={styles.leftRoleList}>
                            {activePlayer.name + ' is picking...'}
                            <div style={{display:'flex'}}>
                                {this.props.activeSession.players.filter((player) => player.id !== activePlayer.id).map((player) => 
                                    <div>{player.name + ': '+ (player.role ? player.role.name : 'Not picked')}</div>
                                )}
                            </div>
                        </div>
                        {activePlayer.id === this.props.currentUser.id && 
                        <div style={{overflow:'auto', borderTop:'1px solid'}}>
                            {this.props.activeSession.roles.filter(this.roleNotPicked).map((role:Role) => 
                                <div style={styles.toggleButton} onClick={()=>onChooseRole(role, this.props.currentUser, this.props.activeSession)}>
                                    <div style={{width:'60%'}}>
                                        <h6>{role.name}:</h6>
                                        <h6>{role.actionDescription}</h6> 
                                    </div>
                                    <div>
                                        <h6>Pick Bonus: ${role.money}</h6> 
                                    </div>
                                </div>)}
                        </div>}
                    </div>
                </div>
                <div style={{...styles.modal, display: this.state.showFundraising || this.props.activeSession.phase === Phases.FUNDRAISE ? 'flex':'none'}}>
                    {TopBar('Fundraiser')}
                    <div style={{display:'flex'}}>
                        <h4>Shakedown a grad for money</h4>
                        <div>
                            {this.props.activeSession.fundraising.map((graduate) => 
                                graduate ? 
                                <div style={(AppStyles.highSchoolTile as any)[graduate.type]}/> : 
                                <div onClick={this.onSellGraduate} style={styles.emptyFundSpot}/>    
                            )}
                        </div>
                    </div>
                </div>
                <Dialog
                    isOpen={this.state.showGraduatePool || this.props.activeSession.phase === Phases.PRODUCE}
                    style={AppStyles.modal}
                    onClose={() => this.setState({ showGraduatePool: false })}
                >
                    <div style={{display:'flex'}}>
                        <h4>Choose what kind of graduate you will make:</h4>
                        {Object.keys(this.props.activeSession.graduatePool).map((key:GraduateTypes) => 
                            <div style={(AppStyles.highSchoolTile as any)[key]} onClick={()=>this.onProduce(key)}>
                                <h6>{(this.props.activeSession.graduatePool as any)[key]} left</h6>
                                <h6>You will produce {getProductionCount(me, key)}</h6>
                            </div>
                        )}
                    </div>
                </Dialog>
                <Dialog>Industry Job Slots</Dialog>
            </div>
        )
    }
}

const styles = {
    frame: {
        backgroundImage: 'url('+require('../../assets/tiny2.png')+')',
        backgroundRepeat: 'repeat',
        borderRadius:'3px',
        margin:'1em',
        border:'1px solid'
    },
    board: {
        display:'flex', padding:'0.5em',
        justifyContent:'space-around'
    },
    modal: {
        backgroundImage: 'url('+require('../../assets/whiteTile.png')+')',
        backgroundRepeat: 'repeat',
        position:'absolute' as 'absolute',
        top:0, left:0, right:0, bottom:0,
        maxWidth: '20em',
        maxHeight: '20em',
        border: '1px solid',
        borderRadius: '5px',
        margin: 'auto',
        flexDirection: 'column' as 'column',
        justifyContent: 'flex-start'
    },
    choiceBtn: {
        margin: 0,
        cursor: 'pointer',
        border: '1px solid',
        padding: '0.5em',
        borderRadius: '5px',
    },
    disabled: {
        position:'absolute' as 'absolute',
        top:0,
        left:0,
        background:'black',
        opacity: 0.1,
        width:'100vw',
        height:'100vh'
    },
    toggleButton: {
        cursor:'pointer',
        border:'1px solid',
        borderRadius: '3px',
        padding:'0.5em',
        display:'flex',
        justifyContent:'space-between',
        background: 'white',
        margin:'0.5em'
    },
    emptyFundSpot: {},
    roleCard: {},
    leftRoleList: {
        display:'flex',
        flexDirection:'column' as 'column',
        justifyContent:'space-around',
        padding:'0.5em',
    }
}