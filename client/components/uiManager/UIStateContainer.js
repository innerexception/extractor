import { connect } from 'react-redux'
import { login, decodeWSMessage, initServer, connected, connectionError, setUser } from './Actions'
import UIManager from './UIManager.jsx'

const mapStateToProps = (state) => {
    return state
};

const mapDispatchToProps = (dispatch) => {
    return {
        onWSMessage: (data) => {
            dispatch(decodeWSMessage(data))
        },
        onInitServer: (props) => {
            dispatch(initServer(props))
        },
        onConnected: () => {
            dispatch(connected())
        },
        onConnectionError: () => {
            dispatch(connectionError())
        }
    }
};


const UIStateContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UIManager);

export default UIStateContainer;