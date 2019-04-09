import * as React from 'react';
import { onMatchStart } from './uiManager/Thunks'
import { TopBar } from './Shared'
import AppStyles from '../AppStyles';

interface Props { 
    activeSession:Session
    currentUser:LocalUser
}

export default class Lobby extends React.Component<Props> {

    startMatch = () => {
        console.log(this.props)
        onMatchStart(
            this.props.currentUser, 
            this.props.activeSession)
    }

    getErrors = () => {
        if(this.props.activeSession.players.length < 2) return 'Waiting for more to join...'
    }

    render(){
        return (
            <div style={{...AppStyles.window}}>
                {TopBar('MacAdmin')}
                <div style={{padding:'0.5em', minWidth:'400px'}}>
                    <h5>{this.props.activeSession.sessionId} Lobby</h5>
                    <div style={{marginBottom:'1em', alignItems:'center', overflow:'auto', maxHeight:'66vh'}}>
                        {this.props.activeSession.players.map((player) => 
                            <div style={styles.nameTag}>
                                {player.name}
                            </div>
                        )}
                    </div>
                    <div>{this.getErrors()}</div>
                    {this.getErrors() ? '' : 
                        <div style={AppStyles.buttonOuter} 
                            onClick={this.startMatch}>
                            <div style={{border:'1px solid', borderRadius: '3px', opacity: this.getErrors() ? 0.5 : 1}}>Start</div>
                        </div>}
                </div>
            </div>
        )
    }
}

const styles = {
    nameTag: {
        background: 'white',
        border: '1px solid',
        padding: '0.25em',
        marginBottom: '5px',
    }
}