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