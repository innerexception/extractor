import React from 'react';
import UIStateContainer from './components/uiManager/UIStateContainer.js';
import 'normalize.css'
import "@blueprintjs/core/lib/css/blueprint.css"
import "@blueprintjs/icons/lib/css/blueprint-icons.css"
import './App.css';

class App extends React.Component {
    render(){
        return (
            <div>
                <UIStateContainer store={this.props.store} />
            </div>
        );
    }
};

export default App