module.exports = {
  ApiUrl: 'ws://localhost:1337',

  ReducerActions: {
    PLAYER_AVAILABLE: 'ma',
    MATCH_UPDATE: 'mu',
    MATCH_TICK: 'mt',
    PLAYER_READY: 'pr',
    PLAYER_ENTERED: 'pe',
    PLAYER_JOIN: 'pj',
    PLAYER_LEFT: 'pl',
    NEW_PHRASE: 'np',
    MATCH_START: 'ms',
    MATCH_WIN: 'mw',
    MATCH_LOST: 'ml',
    MATCH_CLEANUP: 'mc',
    PHRASE_CORRECT: 'pc',
    TIMER_TICK:'tt',
    INIT_SERVER: 'is',
    CONNECTION_ERROR: 'ce',
    CONNECTED: 'c',
    SET_USER: 'su'
  },

  BuildingsPool: [
    {
      name: 'English Department',
      count: 3,
      cost: 1,
      capacity: 1
    },
    {
      name: 'English Department (L)',
      count: 3,
      isLarge: true,
      cost: 3,
      capacity: 2
    },
    {
      name: 'Computer Science Department',
      count: 3,
      cost: 3,
      capacity: 1
    },
    {
      name: 'Computer Science Department (L)',
      count: 3,
      cost: 5,
      isLarge: true,
      capacity: 2
    },
    {
      name: 'Law School',
      count: 2,
      cost: 6,
      isLarge: true,
      capacity: 3
    },
    {
      name: 'Medical School',
      count: 2,
      cost: 7,
      isLarge: true,
      capacity: 2
    },
  ],
  InitialPlayerBuildings: [[null, null, null],[null, null, null],[null, null, null]],
  InitialPlayerStudents: [[null, null, null],[null, null, null],[null, null, null],[null, null, null]],
  InitialRoles: [
    {
      phase: 'BUILD',
      money: 0,
      name: 'Builder',
      actionDescription: 'Build a thing',
      bonusDescription: 'Build a thing for 1 less'    
    },
    {
      phase: 'COLLECT_INTEREST',
      money: 0,
      name: 'Interest',
      actionDescription: 'Get Money',
      bonusDescription: '---'    
    },
    {
      phase: 'FUNDRAISE',
      money: 0,
      name: 'Fundraiser',
      actionDescription: 'Shakedown a graduate',
      bonusDescription: 'Get 1 extra money'    
    },
    {
      phase: 'PLACE_GRADUATES',
      money: 0,
      name: 'Job Placement',
      actionDescription: 'Get someone a job',
      bonusDescription: 'Get 1 extra point'    
    },
    {
      phase: 'PRODUCE',
      money: 0,
      name: 'Graduate',
      actionDescription: 'Get graduates of kind you can produce',
      bonusDescription: 'Get 1 extra graduate'    
    },
    {
      phase: 'RECRUIT_STUDENTS',
      money: 0,
      name: 'Recruit a high school',
      actionDescription: 'Get a highschool to send you one kind of student',
      bonusDescription: 'Choose a prep school instead'    
    },
    {
      phase: 'RECRUIT_TEACHERS',
      money: 0,
      name: 'Recruit Teachers',
      actionDescription: 'Fresh teachers to man your spaces',
      bonusDescription: 'Get extra teachers'    
    },
  ],
  MatchStatus: {
    ACTIVE: 'ACTIVE',
    LOSE: 'LOSE',
    WIN: 'WIN'
  }
};
