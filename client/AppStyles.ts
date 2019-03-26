export default {
    rowSpcCtr: {
        display:'flex',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
        flexWrap: 'wrap'
    },
    colSpcCtr: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    disabledSection: {
        pointerEvents:'none',
        opacity: 0.2,
        display:'flex'
    },
    flex: {
        display:'flex'
    },
    teacher: {
        height: '2em',
        width: '2em',
        borderRadius: '1em',
        background: 'brown',
        cursor:'pointer'
    },
    highSchoolTile: {
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
        quarry: {
            background: 'gray'
        },
        random: {
            background: 'pink'
        }
    },
    emptyStudent: {
        height: '2em',
        width: '2em',
        borderRadius: '1em',
        border: '1px solid gray'
    },
    studentTile: {
        height: '3em',
        width: '3em',
        border: '1px solid gray'
    },
    modal: {
        maxHeight:'80vh',
        overflow:'auto'
    },
}