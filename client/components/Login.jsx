import React from 'react';
import { onLogin } from './uiManager/Thunks.js'

export default class Login extends React.Component {
    state = { name: ''}

    render(){
        return (
            <div>
                <div style={styles.nameTag}>
                    <h2 style={{textAlign:'center', paddingTop:'0.25em'}}>Hi, My Name Is:</h2>
                    <input style={styles.loginInput} type="text" placeholder="Thought Leader" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                </div>
                {this.state.name && <div style={styles.login} onClick={()=>onLogin(getUser(this.state.name), this.props.server)}>Go Do Buisness -></div>}
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
        padding: '1em',
        marginBottom:'2em'
    },
    nameTag: {
        background: 'red',
        borderRadius: '0.5em',
        color: 'white',
    },
    login: {color:'black', cursor:'pointer', textAlign:'right', paddingTop:'1em'}
}