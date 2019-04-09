import * as React from 'react';
import AppStyles from '../../AppStyles'
import { Dialog } from '@blueprintjs/core'
import { onBuild } from '../uiManager/Thunks'
import { getTeachersForPosition } from '../uiManager/Helpers'
import { Boards } from '../../../enum'


interface Props {
    showBuildings: boolean
    activeSession: Session
    onTeacherSelected:Function
    onDropTeacher: Function
    player:Player
    isActive:boolean
}

interface State {
    showBuildings: boolean
    buildX:number
    buildY:number
}

export default class Campus extends React.Component<Props,State> {

    state = { showBuildings: this.props.showBuildings, buildX:0, buildY:0 }

    componentWillReceiveProps = (props:Props) => {
        this.setState({showBuildings: props.showBuildings})
    }

    build = (building:Building, x:number, y:number) => {
        onBuild(x, y, building, this.props.player, this.props.activeSession)
        this.setState({showBuildings:false})
    }

    render(){
        return <div style={this.props.isActive ? AppStyles.flex : AppStyles.disabledSection}>
            {new Array(3).fill(null).map((row,i) => 
                <div>
                    {this.props.player.buildings[i].map((building, j) => 
                    building ? 
                        <div onMouseUp={()=>this.props.onDropTeacher(Boards.Campus, i,j)} 
                             style={{...(building.capacity > 1 ? styles.largeBuilding : styles.smallBuilding), ...styles.building}}>
                            <h6>{building.name}</h6>
                            <div style={{position:'relative'}}>
                                {new Array(building.capacity).fill(null).map((empty) => 
                                    <div style={AppStyles.emptyStudent}/>
                                )}
                                <div style={{position:'absolute', top:0}}>
                                    {getTeachersForPosition(i,j, this.props.player.teachers, Boards.Campus).map((teacher) => 
                                        <div style={AppStyles.teacher} 
                                            onMouseDown={()=>this.props.onTeacherSelected(teacher)}/>)}
                                </div>
                            </div>
                        </div> :
                        <div onClick={()=>this.setState({showBuildings: true, buildX:i, buildY:j})} 
                             style={styles.building}/>
                    )}
                </div>
            )}
            <Dialog
                    isOpen={this.state.showBuildings}
                    style={AppStyles.modal}
                    onClose={() => this.setState({ showBuildings: false })}
                >
                    <div>
                        {this.props.activeSession.buildings.map((building) => {
                            if(this.props.activeSession.buildings.find((pbuilding) => pbuilding.count > 0 && building.name === pbuilding.name))
                                return <div onClick={()=>this.build(building, this.state.buildX, this.state.buildY)} 
                                            style={{pointerEvents: this.props.player.money >= building.cost ? 'all' : 'none'}}>
                                            {building.name} left: {building.count} cost: {building.cost}
                                       </div>
                            else return <div style={styles.building}/>
                        })}
                    </div>
            </Dialog>
        </div>
    }
}

const styles = {
    smallBuilding: {
        backgroundColor: AppStyles.colors.grey1
    },
    largeBuilding: {
        backgroundColor: AppStyles.colors.grey2
    },
    building: {
        height: '2em',
        width:'4em',
        border: '1px solid gray',
        padding:'2px',
        position: 'relative' as 'relative',
        backgroundColor: AppStyles.colors.grey3
    }
}