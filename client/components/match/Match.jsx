import React from 'react';
import { onMatchTick, onPlaceTeacher, onEndTurn, onShipGraduates, onSellGraduates, onGetGraduates, onBuild, onGetTile, onChooseRole } from '../uiManager/Thunks.js'
import { Button, Card, Dialog, Tooltip, Position, Icon, Radio, RadioGroup, Popover } from '@blueprintjs/core'
import Constants from '../../../Constants.js'
import Campus from './Campus.jsx'
import StudentBody from './StudentBody.jsx'
import AppStyles from '../../AppStyles.js';

export default class Match extends React.Component {

    state = {
        interval: null
    }

    componentDidMount = () => {
        this.setState({interval: this.state.isActive && setInterval(()=>this.checkTimer(), 1000)})
    }

    dropTeacher = (board, x, y) => {
        if(this.state.draggingTeacher){
            onPlaceTeacher(this.state.draggingTeacher, board, x, y, this.props.currentUser, this.props.activeSession, this.props.server)
            this.setState({draggingTeacher: null})
        }
    }
                            
    endTurn = () => {
        clearInterval(this.state.interval)
        onEndTurn(this.props.currentUser, this.props.activeSession.sessionName, this.props.server)
    }

    checkTimer = () => {
        if(this.props.activeSession.ticks >= this.props.activeSession.turnTickLimit){
            this.endTurn()
        }
        else onMatchTick(this.props.activeSession, this.props.server)
    }

    roleNotPicked = (role) => {
        const pickedRoles = this.props.activeSession.players.map((player) => player.role).filter((role) => role)
        return !pickedRoles.find((prole) => prole.name === role.name)
    }

    render(){

        const activePlayer = this.props.activeSession.players.find((player) => player.id === this.props.activeSession.activePlayerId)
        const me = this.props.activeSession.players.find((player) => this.props.currentUser.id === player.id)

        return (
            <div style={styles.frame} onMouseUp={()=>this.setState({draggingTeacher:null})}>
                <h4>{this.props.currentUser.name} {this.props.activeSession.bossId === me.id ? ' paid the cost to be the boss': ''}</h4>
                <h4>{activePlayer.name+ " is currently "+this.props.activeSession.phase}</h4>
                {activePlayer.id !== this.props.currentUser.id && <div style={styles.disabled}/>}
                <div style={{display:'flex'}}>
                    <Campus player={me} 
                            activeSession={this.props.activeSession}
                            onTeacherSelected={(teacher)=>this.setState({draggingTeacher: teacher})}
                            server={this.props.server}
                            onDropTeacher={(board, x, y)=>this.dropTeacher(board, x, y)}
                            showBuildings={this.state.showBuildings}
                            isActive={(this.props.activeSession.phase === Constants.Phases.BUILD || this.props.activeSession.phase === Constants.Phases.RECRUIT_TEACHERS) && activePlayer.id === me.id}/>
                    <StudentBody player={me} 
                                 activeSession={this.props.activeSession}
                                 server={this.props.server}
                                 onTeacherSelected={(teacher)=>this.setState({draggingTeacher: teacher})}
                                 onDropTeacher={(board, x, y)=>this.dropTeacher(board, x, y)}
                                 isActive={(this.props.activeSession.phase === Constants.Phases.RECRUIT_STUDENTS || this.props.activeSession.phase === Constants.Phases.RECRUIT_TEACHERS) && activePlayer.id === me.id}/>
                    {me.role ? 
                        <div style={styles.roleCard}>
                            <h4>{me.role.readableName}</h4>
                            <hr/>
                            <h5>{me.role.actionDescription}</h5>
                            <h5>{me.role.bonusDescription}</h5>
                        </div> : 
                        <div>no role yet</div>}
                    <div>
                        <h5>VP: {me.vp}</h5>
                        <h5>$: {me.money}</h5>
                        {me.resources.map((resource) => 
                            <div style={this.props.activeSession.phase === Constants.Phases.PRODUCE ? styles.active : styles.disabled}>
                                <div onClick={onProduceResourceType(resource)}/>
                                <h5>{resource.type} : {resource.count}</h5>
                            </div>)}
                        <div style={this.props.activeSession.phase === Constants.Phases.RECRUIT_TEACHERS && activePlayer.id === me.id ? AppStyles.flex : AppStyles.disabledSection}>
                            <h6>Unassigned Teachers:</h6>
                            {me.teachers.filter((teacher)=>!teacher.board).map((teacher) => 
                                <div style={AppStyles.teacher} onMouseDown={()=>this.setState({draggingTeacher: teacher})}/>)}
                        </div>
                    </div>
                    <div style={styles.choiceBtn} onClick={this.endTurn}>End Turn</div>
                    <div style={{marginTop:'0.5em', marginBottom:'0.5em'}}>
                        <h6 style={{margin:0}}>Turn</h6>
                        <div style={{width: '100%', height:'0.5em', border: '1px solid'}}>
                            <div style={{width: (100-((this.props.activeSession.ticks / this.props.activeSession.tickLimit)*100))+'%', background:'orange', height:'100%', transition:'width 250ms'}}/>
                        </div>
                    </div>
                </div>
                <div style={{display:'flex'}}>
                    <div style={styles.toggleButton} onClick={()=>this.setState({showJobSlots: !this.state.showJobSlots})}>Show/Hide Industry Job Slots</div>
                    <div style={styles.toggleButton} onClick={()=>this.setState({showBuildings: !this.state.showBuildings})}>Show/Hide Buildings</div>
                    <div style={styles.toggleButton} onClick={()=>this.setState({showGraduatePool: !this.state.showGraduatePool})}>Show/Hide Graduate Pool</div>
                    <div style={styles.toggleButton} onClick={()=>this.setState({showStudentTiles: !this.state.showStudentTiles})}>Show/Hide Student Tiles</div>
                    <div style={styles.toggleButton} onClick={()=>this.setState({showFundraising: !this.state.showFundraising})}>Show/Hide Fundraising</div>
                </div>
                <Dialog
                    isOpen={this.state.showChooseRoles || this.props.activeSession.phase === Constants.Phases.CHOOSE_ROLES}
                    style={styles.modal}
                    onClose={() => this.setState({ showChooseRoles: false })}
                >
                    <div style={{display:'flex'}}>
                        <div>
                            {activePlayer.name + ' is picking...'}
                            {this.props.activeSession.players.filter((player) => player.id !== activePlayer.id).map((player) => 
                                <div>{player.name + ': '+ (player.role ? player.role.readableName : 'Not picked')}</div>
                            )}
                        </div>
                        {activePlayer.id === this.props.currentUser.id && 
                        <div>
                            {Constants.Roles.filter(this.roleNotPicked).map((role) => 
                                <div style={styles.toggleButton} onClick={()=>onChooseRole(role, this.props.currentUser, this.props.activeSession, this.props.server)}>
                                    {role.readableName}
                                </div>)}
                        </div>}
                    </div>
                </Dialog>
                <Dialog>Available Graduates</Dialog>
                <Dialog>Next Student Tiles</Dialog>
                <Dialog>Industry Job Slots</Dialog>
                <Dialog>Fundraising</Dialog>
            </div>
        )
    }
}

const styles = {
    frame: {
        padding:'1em',
        position:'relative'
    },
    choiceBtn: {
        margin: 0,
        cursor: 'pointer',
        border: '1px solid',
        padding: '0.5em',
        borderRadius: '5px',
    },
    disabled: {
        position:'absolute',
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
        padding:'0.5em'
    }
}