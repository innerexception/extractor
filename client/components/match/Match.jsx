import React from 'react';
import { onMatchTick, onPlaceTeacher, onPlaceGraduate, onShipGraduates, onSellGraduates, onGetGraduates, onBuild, onGetTile, onChooseRole } from '../uiManager/Thunks.js'
import { Button, Card, Dialog, Tooltip, Position, Icon, Radio, RadioGroup, Popover } from '@blueprintjs/core'
import Constants from '../../../Constants.js'
import Campus from './Campus.jsx'
import StudentBody from './StudentBody.jsx'

export default class Match extends React.Component {

    state = {
        interval: null
    }

    componentDidMount = () => {
        this.setState({interval: this.state.isActive && setInterval(()=>this.checkTimer(), 1000)})
    }

    dropTeacher = (board, x, y) => {
        onPlaceTeacher(this.state.draggingTeacher, board, x, y)
        this.setState({draggingTeacher: null})
    }
                            
    endTurn = () => {
        clearInterval(this.state.interval)
        onEndTurn(this.props.activeSession.sessionName, this.props.server)
    }

    checkTimer = () => {
        if(this.props.activeSession.ticks >= this.props.activeSession.turnTickLimit){
            this.endTurn()
        }
        else onMatchTick(this.props.activeSession, this.props.server)
    }

    render(){

        const activePlayer = this.props.activeSession.players.find((player) => player.id === this.props.activeSession.activePlayerId)

        return (
            <div style={styles.frame}>
                <h4>{activePlayer.name}</h4>
                {activePlayer.id !== this.props.currentUser.id && <div style={styles.disabled}/>}
                <div style={{display:'flex'}}>
                    <Campus player={activePlayer} 
                            onShowBuildingSelect={(x,y)=>this.setState({showBuildingModal: true, buildX:x, buildY:y })}
                            onTeacherSelected={(teacher)=>this.setState({draggingTeacher: teacher})}
                            onDropTeacher={(board, x, y)=>this.dropTeacher(board, x, y)}
                            isActive={this.props.activeSession.phase === Constants.Phases.BUILD}/>
                    <StudentBody player={activePlayer} 
                                 onTeacherSelected={(teacher)=>this.setState({draggingTeacher: teacher})}
                                 onDropTeacher={(board, x, y)=>this.dropTeacher(board, x, y)}
                                 isActive={this.props.activeSession.phase === Constants.Phases.RECRUIT_STUDENT}/>
                    <div style={styles.roleCard}>
                        <h4>{activePlayer.role.name}</h4>
                        <hr/>
                        <h5>{role.actionDescription}</h5>
                        <h5>{role.bonusDescription}</h5>
                    </div>
                    <div>
                        <h5>VP: {activePlayer.vp}</h5>
                        <h5>$: {activePlayer.money}</h5>
                        {activePlayer.resources.map((resource) => 
                            <div style={this.props.activeSession.phase === Constants.Phases.PRODUCE ? styles.active : styles.disabled}>
                                <div onClick={onProduceResourceType(resource)}/>
                                <h5>{resource.type} : {resource.count}</h5>
                            </div>)}
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
                    <div>Show/Hide Industry Job Slots</div>
                    <div>Show/Hide Buildings</div>
                    <div>Show/Hide Graduate Pool</div>
                    <div>Show/Hide Student Tiles</div>
                    <div>Show/Hide Fundraising</div>
                </div>
                <Dialog
                    isOpen={this.state.showChooseRoles}
                    style={styles.modal}
                    onClose={() => this.setState({ showChooseRoles: false })}
                >
                    {Constants.Roles.map((role) => <Button text={role} onClick={()=>onChooseRole(role, this.props.currentUser, this.props.activeSession, this.props.server)}/>)}
                </Dialog>
                <Dialog
                    isOpen={this.state.showChooseRoles}
                    style={styles.modal}
                    onClose={() => this.setState({ showChooseRoles: false })}
                >Build</Dialog>
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
        pointerEvents:'none',
        width:'100vw',
        height:'100vh'
    }
}