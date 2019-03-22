import React from 'react';
import AppStyles from '../../AppStyles'
import { Dialog } from '@blueprintjs/core'
import { onTilePlaced, getRandomTile } from '../uiManager/Thunks.js'

export default class StudentBody extends React.Component {
    state = { showTiles: false }

    placeTile = (tile) => {
        this.setState({showTiles:false})
        onTilePlaced(tile, this.state.tileX, this.state.tileY, this.props.player, this.props.activeSession, this.props.server)
    }

    render(){
       return <div style={this.props.isActive ? AppStyles.flex : AppStyles.disabledSection}>
            {new Array(4).fill().map((row,i) => 
                <div>
                    {this.props.player.students[i].map((student, j) => 
                    student ? 
                        <div onMouseUp={()=>this.props.onDropTeacher('highschools', i,j)} 
                             style={styles.studentTile}>
                            <div style={{...styles[student.type], ...styles.studentTile}}/>
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
                        {this.props.activeSession.tiles.map((tile) => 
                            <div style={{...styles[tile], ...styles.studentTile}} onClick={()=>this.placeTile(tile)}/>    
                        )}
                        <div style={{...styles.random, ...styles.studentTile}} onClick={()=>this.placeTile(getRandomTile())}/>    
                        {this.props.activeSession.quarries > 0 && 
                            <div style={{...styles.quarry, ...styles.studentTile}} onClick={()=>this.placeTile('quarry')}/>} 
                    </div>
            </Dialog>
        </div>
    }
}

const getTeachersForPosition = (x,y, teachers) => teachers.filter((teacher) => teacher.x === x && teacher.y === y && teacher.board !== 'campus')

const styles = {
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