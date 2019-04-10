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
        border: '1px solid gray',
        background: '#f3f3f3'
    },
    modal: {
        maxHeight:'80vh',
        overflow:'auto'
    },
    colors: {
        white: '#f3f3f3',
        grey1: '#d5d5d5',
        grey2: '#b3b3b3',
        grey3:'#5f5f5f',
        black:'#252525'
    },
    window: {
        background: '#f3f3f3',
        borderRadius: '5px',
        border: '1px solid'
    },
    buttonOuter: {
        color: '#252525', 
        cursor:'pointer',
        textAlign:'center' as 'center',
        border: '3px solid',
        borderRadius: '5px',
        background:'white',
        width:'50%',
        marginLeft:'calc(50% - 0.5em)',
        padding:'2px'
    },
    buttonInner: {
        border:'1px solid', borderRadius: '3px', paddingLeft:'5px', paddingRight:'5px' ,
        color: '#252525', 
        background:'white',
        cursor:'pointer'
    },
    topBar: {
        background: 'white',
        display:'flex',
        justifyContent:'space-around',
        alignItems: 'center',
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        borderBottom: '1px solid',
        height:'1em'
    },
    notification: {textAlign:'center', padding:'0.5em', border:'1px solid', borderRadius:'5px', background:'#f3f3f3', fontFamily:'Comicoro'},
    hr: {
        margin:0,
        marginBottom:'1px'
    },
}