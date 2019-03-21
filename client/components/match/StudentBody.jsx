import React from 'react';
import AppStyles from '../../AppStyles'

export default class StudentBody extends React.Component {
    render(){
       return <div style={this.props.isActive ? AppStyles.flex : AppStyles.disabledSection}>
            {new Array(4).fill().map((row,i) => 
                <div>
                    {this.props.player.students[i].map((student, j) => 
                    student ? 
                        <div style={styles.studentTile}>
                            <div style={styles[student.type]}/>
                            {student.teacher && 
                                <div style={styles.teacher} 
                                     onMouseDown={()=>this.props.onTeacherSelected(student.teacher)}/>}
                        </div> :
                        <div style={styles.studentTile}>
                            <div onClick={()=>this.props.onShowStudentSelect(i,j)} 
                                style={styles.emptyStudent}/>
                        </div>
                    )}
                </div>
            )}
        </div>
    }
}

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
    }
}