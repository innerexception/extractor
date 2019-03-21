import React from 'react';

export default class Campus extends React.Component {
    render(){
        return <div style={{pointerEvents: this.props.isActive ? 'all':'none', display:'flex'}}>
            {new Array(3).fill().map((row,i) => 
                <div>
                    {this.props.player.buildings[i].map((building, j) => 
                    building ? 
                        <div style={building.isLarge ? styles.largeBuilding : styles.smallBuilding}>
                            {building.name}
                            {building.teachers.length > 0 && 
                                building.teachers.map((teacher) => 
                                    <div style={styles.teacher} 
                                         onMouseDown={()=>this.props.onTeacherSelected(teacher)}/>)}
                        </div> :
                        <div onClick={()=>this.props.onShowBuildingSelect(i,j)} 
                             style={styles.emptyBuilding}/>
                    )}
                </div>
            )}
        </div>
    }
}

const styles = {
    smallBuilding: {
        height: '2em',
        width:'4em',
        background: 'blue'
    },
    largeBuilding: {
        height: '2em',
        width:'4em',
        background: 'purple'
    },
    emptyBuilding: {
        height: '2em',
        width:'4em',
        background: 'gray'
    }
}