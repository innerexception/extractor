import React from 'react';
import AppStyles from '../../AppStyles'
import { Dialog } from '@blueprintjs/core'
import Constants from '../../../Constants.js'
import { onBuild } from '../uiManager/Thunks.js'

export default class Campus extends React.Component {

    state = { showBuildings: this.props.showBuildings, buildX:0, buildY:0 }

    componentWillReceiveProps = (props) => {
        this.setState({showBuildings: props.showBuildings})
    }

    build = (building, x, y) => {
        building.x = x
        building.y = y
        building.teachers = []
        onBuild(building, this.props.player, this.props.activeSession, this.props.server)
        this.setState({showBuildings:false})
    }

    render(){
        return <div style={this.props.isActive ? AppStyles.flex : AppStyles.disabledSection}>
            {new Array(3).fill().map((row,i) => 
                <div>
                    {this.props.player.buildings[i].map((building, j) => 
                    building ? 
                        <div onMouseUp={()=>this.props.onDropTeacher('campus', i,j)} 
                             style={building.isLarge ? styles.largeBuilding : styles.smallBuilding}>
                            {building.name}
                            {getTeachersForPosition(i,j, this.props.player.teachers).map((teacher) => 
                                    <div style={AppStyles.teacher} 
                                         onMouseDown={()=>this.props.onTeacherSelected(teacher)}/>)}
                        </div> :
                        <div onClick={()=>this.setState({showBuildings: true, buildX:i, buildY:j})} 
                             style={styles.emptyBuilding}/>
                    )}
                </div>
            )}
            <Dialog
                    isOpen={this.state.showBuildings}
                    style={styles.modal}
                    onClose={() => this.setState({ showBuildings: false })}
                >
                    <div>
                        {this.props.activeSession.buildings.map((building) => {
                            if(this.props.activeSession.buildings.find((pbuilding) => pbuilding.count > 0 && building.name === pbuilding.name))
                                return <div onClick={()=>this.build(building, this.state.buildX, this.state.buildY)} 
                                            style={{pointerEvents: this.props.player.money >= building.cost ? '' : 'none'}}>
                                            {building.name} left: {building.count} cost: {building.cost}
                                       </div>
                            else return <div style={styles.emptyBuilding}/>
                        })}
                    </div>
            </Dialog>
        </div>
    }
}

const getTeachersForPosition = (x,y, teachers) => teachers.filter((teacher) => teacher.x === x && teacher.y === y)

const styles = {
    smallBuilding: {
        height: '2em',
        width:'4em',
        border: '1px solid blue',
        padding:'2px'
    },
    largeBuilding: {
        height: '2em',
        width:'4em',
        border: '1px solid purple',
        padding:'2px'
    },
    emptyBuilding: {
        height: '2em',
        width:'4em',
        border: '1px solid gray',
        padding:'2px'
    }
}