import React from 'react';
import { onMatchTick, onPlaceTeacher, onPlaceGraduate, onShipGraduates, onSellGraduates, onGetGraduates, onBuild, onGetTile, onPickRole } from '../uiManager/Thunks.js'
import Constants from '../../../Constants'

export default class Match extends React.Component {

    state = {
        interval: null
    }

    componentDidMount = () => {
        this.setState({interval: this.state.isActive && setInterval(()=>this.checkTimer(), 1000)})
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
                            onShowBuildingSelect 
                            onTeacherSelected
                            isActive={this.props.activeSession.phase === Constants.Phases.BUILD}/>
                    <StudentBody player={activePlayer} 
                                 onTeacherSelected
                                 isActive={this.props.activeSession.phase === Constants.Phases.RECRUIT_STUDENT}/>
                                 onShowStudentSelect/>
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
                <Modal>Choose Role</Modal>
                <Modal>Build</Modal>
                <Modal>Available Graduates</Modal>
                <Modal>Next Student Tiles</Modal>
                <Modal>Industry Job Slots</Modal>
                <Modal>Fundraising</Modal>
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