import React from 'react';

export default class StudentBody extends React.Component {
    render(){
       return <div style={{pointerEvents: this.props.isActive ? 'all':'none', display:'flex'}}>
            {new Array(4).fill().map((row,i) => 
                <div>
                    {this.props.player.students[i].map((student, j) => 
                    student ? 
                        <div>
                            <div style={styles[student.type]}/>
                            {student.teacher && 
                                <div style={styles.teacher} 
                                     onMouseDown={()=>this.props.onTeacherSelected(student.teacher)}/>}
                        </div> :
                        <div onClick={()=>this.props.onShowStudentSelect(i,j)} 
                             style={styles.emptyStudent}/>
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
    emptyStudent: {
        height: '2em',
        width: '2em',
        borderRadius: '1em',
        background: 'gray'
    }
}