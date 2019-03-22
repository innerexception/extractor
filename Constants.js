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

  Phases: {
    CHOOSE_ROLES: 'CHOOSE_ROLES',
    BUILD:'BUILD',
    RECRUIT_TEACHERS:'RECRUIT_TEACHERS',
    RECRUIT_STUDENTS:'RECRUIT_STUDENTS',
    FUNDRAISE:'FUNDRAISE',
    PRODUCE:'PRODUCE',
    PLACE_GRADUATES:'PLACE_GRADUATES',
    COLLECT_INTEREST:'INTEREST'
  },

  GraduateTypes: {
    COMMUNICATIONS: 'com',
    ENGLISH: 'eng',
    COMPSCI: 'comp',
    LAWYER: 'law',
    DOCTOR: 'dr'
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

  Roles: [
    {
      name: 'BUILD', 
      readableName: 'Expand', 
      actionDescription: 'Build a building on campus.', 
      bonusDescription: 'Building costs 1 less.'
    },
    {
      name: 'RECRUIT_TEACHERS', 
      readableName: 'Recruit Teachers', 
      actionDescription: 'Build a building on campus.', 
      bonusDescription: 'Building costs 1 less.'
    },
    {
      name: 'RECRUIT_STUDENTS', 
      readableName: 'Recruit Students', 
      actionDescription: 'Build a building on campus.', 
      bonusDescription: 'Building costs 1 less.'
    },
    {
      name: 'FUNDRAISE', 
      readableName: 'Hold Fundraiser', 
      actionDescription: 'Build a building on campus.',
      bonusDescription: 'Building costs 1 less.'
    },
    {
      name: 'PRODUCE', 
      readableName: 'Produce Graduates',
      actionDescription: 'Build a building on campus.', 
      bonusDescription: 'Building costs 1 less.'
    },
    {
      name: 'PLACE_GRADUATES', 
      readableName: 'Place Graduates',
      actionDescription: 'Build a building on campus.', 
      bonusDescription: 'Building costs 1 less.'
    },
    {
      name: 'INTEREST', 
      readableName: 'Collect Interest',
      actionDescription: 'Collect interest from the endowment.', 
      bonusDescription: '----'
    }
  ],

  MatchStatus: {
    ACTIVE: 'aa',
    LOST: 'll',
    WIN: 'win'
  }
};
