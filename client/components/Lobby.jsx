import React from 'react';
import { onMatchStart } from './uiManager/Thunks.js'

export default class Lobby extends React.Component {

    startMatch = () => {
        onMatchStart(
            this.props.activeSession.sessionName, 
            this.props.currentUser, 
            this.props.server)
    }

    getErrors = () => {
        if(this.props.activeSession.players.length < 2) return 'Waiting for more employees to join...'
    }

    render(){
        return (
            <div style={{width:'100%'}}>
                <div style={{padding:'1em'}}>Meanwhile in Conference Room 3F at {this.props.activeSession.sessionName}'s HQ, the team assembles...</div>
                <div style={{padding:'1em', display:'flex', alignItems:'center', overflowX:'auto'}}>
                    {this.props.activeSession.players.map((player) => 
                        <div style={styles.nameTag}>
                            <input style={styles.loginInput} type="text" value={player.name}/>
                        </div>
                    )}
                </div>
                <div>{this.getErrors()}</div>
                {this.getErrors() ? '' : <div style={{cursor:'pointer', margin:'1em', textAlign:'right'}} onClick={this.startMatch}>Start Extracting -></div>}
            </div>
        )
    }
}

const styles = {
    nameTag: {
        background: 'red',
        borderRadius: '0.5em',
        color: 'white',
        pointerEvents:'none',
        width:'13em',
        marginRight:'1em'
    },
    loginInput: {
        boxShadow: 'none',
        border: 'none',
        padding: '0.5em',
        marginBottom:'1em',
        marginTop:'1em'
    }
}