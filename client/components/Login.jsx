import React from 'react';
import { onLogin } from '../uiManager/Thunks.js'

export default class Login extends React.Component {
    state = { name: '', sessionName: ''}

    render(){
        return (
            <div>
                <div style={styles.nameTag}>
                    <h2 style={{textAlign:'center', paddingTop:'0.25em'}}>Hi, My Name Is:</h2>
                    <input style={styles.loginInput} type="text" placeholder="Thought Leader" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                    <div style={{padding:'0.25em'}}>Buisness Name:</div>
                    <input style={{...styles.loginInput, marginBottom:'1em'}} type="text" placeholder="CorpTron" value={this.state.sessionName} onChange={(e)=>this.setState({sessionName:e.currentTarget.value})}/>
                </div>
                {this.state.name && this.state.sessionName && <div style={styles.login} onClick={()=>onLogin(getUser(this.state.name), this.state.sessionName, this.props.server)}>Go Do Buisness -></div>}
            </div>
        )
    }
}

const getUser = (name) => {
   return {name,id: Date.now() + ''+ Math.random()}
}

const styles = {
    loginInput: {
        boxShadow: 'none',
        border: 'none',
        padding: '1em'
    },
    nameTag: {
        background: 'red',
        borderRadius: '0.5em',
        color: 'white',
    },
    login: {color:'black', cursor:'pointer', textAlign:'right', paddingTop:'1em'}
}