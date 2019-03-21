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
  },

  Roles: [
    'BUILD',
    'RECRUIT_TEACHERS',
    'RECRUIT_STUDENTS',
    'FUNDRAISE',
    'PRODUCE',
    'PLACE_GRADUATES',
  ],

  MatchStatus: {
    ACTIVE: 'aa',
    LOST: 'll',
    WIN: 'win'
  }
};
