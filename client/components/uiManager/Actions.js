import Constants from "../../../Constants";

export const setUser = (currentUser) => {
    return {
        type: Constants.ReducerActions.SET_USER,
        currentUser
    }
}

export const initServer = (props) => {
    return {
        type: Constants.ReducerActions.INIT_SERVER,
        props
    }
}

export const connected = () => {
    return {
        type: Constants.ReducerActions.CONNECTED
    }
}

export const connectionError = () => {
    return {
        type: Constants.ReducerActions.CONNECTION_ERROR
    }
}

export const decodeWSMessage = (data) => {
    if (!data ) {
      return {
          type:'noop'
      }
    }
    var payload = JSON.parse(data.data);
    return {...payload}
}

