import * as React from 'react';
import AppStyles from '../../AppStyles'
import { Dialog } from '@blueprintjs/core'
import { onTilePlaced } from '../uiManager/Thunks'
import { getTeachersForPosition, getRandomTile } from '../uiManager/Helpers'
import { GraduateTypes, Boards } from '../../../enum'
import App from '../../App';


interface Props {
    player: Player
    activeSession: Session
    isActive: boolean
    onTeacherSelected: Function
    onDropTeacher: Function
}

interface State {
    showTiles: boolean
    tileX:number
    tileY:number
}

export default class HighSchools extends React.Component<Props, State> {
    state = { showTiles: false, tileX: 0, tileY:0 }

    placeTile = (tileType:GraduateTypes) => {
        this.setState({showTiles:false})
        onTilePlaced(tileType, this.state.tileX, this.state.tileY, this.props.player, this.props.activeSession)
    }

    render(){
       return <div style={this.props.isActive ? AppStyles.flex : AppStyles.disabledSection}>
            {new Array(4).fill(null).map((row,i) => 
                <div>
                    {this.props.player.highSchools[i].map((student, j) => 
                    student ? 
                        <div onMouseUp={()=>this.props.onDropTeacher(Boards.HighSchools, i,j)} 
                             style={AppStyles.studentTile}>
                            <div style={{...(AppStyles.highSchoolTile as any)[student.type], height:'100%', width:'100%'}}>
                                {getTeachersForPosition(i,j, this.props.player.teachers, Boards.HighSchools).map((teacher) => 
                                    <div style={{...AppStyles.teacher, zIndex:2}} 
                                         onMouseDown={()=>this.props.onTeacherSelected(teacher)}/>)}
                            </div>
                        </div> :
                        <div style={AppStyles.studentTile}>
                            <div onClick={()=>this.setState({showTiles:true, tileX: i, tileY: j})} 
                                style={AppStyles.emptyStudent}/>
                        </div>
                    )}
                </div>
            )}
            <Dialog
                    isOpen={this.state.showTiles}
                    style={AppStyles.modal}
                    onClose={() => this.setState({ showTiles: false })}
                >
                    <div>
                        {this.props.activeSession.highSchools.map((schoolType) => 
                            <div style={{...(AppStyles.highSchoolTile as any)[schoolType], ...AppStyles.studentTile}} onClick={()=>this.placeTile(schoolType)}/>    
                        )}
                        <div style={{...AppStyles.highSchoolTile.random, ...AppStyles.studentTile}} onClick={()=>this.placeTile(getRandomTile())}/>    
                        {this.props.activeSession.quarries > 0 && 
                            <div style={{...AppStyles.highSchoolTile.quarry, ...AppStyles.studentTile}} onClick={()=>this.placeTile(GraduateTypes.TRADES)}/>} 
                    </div>
            </Dialog>
        </div>
    }
}