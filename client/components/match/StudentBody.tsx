import * as React from 'react';
import AppStyles from '../../AppStyles'
import { Dialog } from '@blueprintjs/core'
import { onTilePlaced, getRandomTile } from '../uiManager/Thunks'

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

export default class StudentBody extends React.Component<Props, State> {
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
                        <div onMouseUp={()=>this.props.onDropTeacher('highschools', i,j)} 
                             style={styles.studentTile}>
                            <div style={{...(AppStyles.highSchoolTile as any)[student.type], ...styles.studentTile}}/>
                            {getTeachersForPosition(i,j, this.props.player.teachers).map((teacher) => 
                                    <div style={AppStyles.teacher} 
                                         onMouseDown={()=>this.props.onTeacherSelected(teacher)}/>)}
                        </div> :
                        <div style={styles.studentTile}>
                            <div onClick={()=>this.setState({showTiles:true, tileX: i, tileY: j})} 
                                style={styles.emptyStudent}/>
                        </div>
                    )}
                </div>
            )}
            <Dialog
                    isOpen={this.state.showTiles}
                    style={styles.modal}
                    onClose={() => this.setState({ showTiles: false })}
                >
                    <div>
                        {this.props.activeSession.highSchools.map((schoolType) => 
                            <div style={{...(AppStyles.highSchoolTile as any)[schoolType], ...styles.studentTile}} onClick={()=>this.placeTile(schoolType)}/>    
                        )}
                        <div style={{...styles.random, ...styles.studentTile}} onClick={()=>this.placeTile(getRandomTile())}/>    
                        {this.props.activeSession.quarries > 0 && 
                            <div style={{...styles.quarry, ...styles.studentTile}} onClick={()=>this.placeTile(GraduateTypes.TRADES)}/>} 
                    </div>
            </Dialog>
        </div>
    }
}

const getTeachersForPosition = (x:number,y:number, teachers:Array<Teacher>) => 
    teachers.filter((teacher) => teacher.x === x && teacher.y === y && teacher.board !== 'campus')

const styles = {
    modal: {},
    teacher: {
        height: '2em',
        width: '2em',
        borderRadius: '1em',
        background: 'brown'
    },
    studentTile: {
        height:'3em',
        width:'3em',
        border: '1px solid',
        padding:'2px'
    },
    emptyStudent: {
        height: '2em',
        width: '2em',
        borderRadius: '1em',
        border: '1px solid gray'
    },
    quarry: {
        background: 'gray'
    },
    com: {
        background:'yellow'
    },
    eng: {
        background:'blue'
    },
    comp: {
        background:'red'
    },
    law: {
        background: 'black'
    },
    dr: {
        background: 'orange'
    },
    random: {
        background: 'pink'
    }
}