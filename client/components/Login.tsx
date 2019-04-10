import * as React from 'react';
import { onLogin } from './uiManager/Thunks'
import { TopBar, Button } from './Shared'
import AppStyles from '../AppStyles';

export default class Login extends React.Component {
    state = { name: '', sessionId: ''}

    render(){
        return (
            <div>
                <div style={{...AppStyles.window}}>
                    {TopBar('MacAdmins')}
                    <div style={{padding:'0.5em'}}>
                        <h5 style={{margin:'0'}}>Name</h5>
                        <input style={{...styles.loginInput, marginBottom:'0.5em'}} type="text" value={this.state.name} onChange={(e)=>this.setState({name:e.currentTarget.value})}/>
                        <h5 style={{margin:'0'}}>Match Name</h5>
                        <input style={{...styles.loginInput, marginBottom:'1em'}} type="text" value={this.state.sessionId} onChange={(e)=>this.setState({sessionId:e.currentTarget.value})}/>
                        {Button(this.state.name && this.state.sessionId as any, ()=>onLogin(getUser(this.state.name), this.state.sessionId), 'Ok')}
                    </div>
                </div>
            </div>
        )
    }
}

const getUser = (name:string) => {
   return {name,id: Date.now() + ''+ Math.random()}
}

const styles = {
    loginInput: {
        border: '1px solid',
        boxShadow: 'none',
        padding:'3px'
    },
    nameTag: {
        background: 'red',
        borderRadius: '0.5em',
        color: 'white',
    },
    login: {color:'black', cursor:'pointer', textAlign:'right' as 'right', paddingTop:'1em'}
}