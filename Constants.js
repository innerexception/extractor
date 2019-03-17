module.exports = {
  ApiUrl: 'ws://ec2-35-172-141-166.compute-1.amazonaws.com:1337',

  ReducerActions: {
    MATCH_AVAILABLE: 'ma',
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

  MatchStatus: {
    ACTIVE: 'aa',
    LOST: 'll',
    WIN: 'win'
  },

  Phrases: [
    'Synergize the paradigm',
    'Drive value',
    'Operationalize the strategy',
    'Leverage our core compentencies',
    'Wholeistically administrate exceptional synergy',
    'Set the brand trajectory',
    'Advance the marketshare',
    'Promote viability and diversity in the supply chain',
    'Monetize our assets',
    'Visualize a value added experience',
    'Perform seamless cross-platform integrations',
    'Gain traction with our capitalized reputation in the marketplace',
    'Incentivize mission critical behaviors',
    'Implement flexible solutions for the customer base',
    'Take this conversation offline',
    'Execute opportunistic strategies',
    'Empower the product swimlanes',
    'Increase our share of wallet',
    'Activate thought leadership',
    'Form some tiger teams',
    'Fix the verbage in out takeaway',
    'Implement robust solutioning',
    'Hit the ground running with content marketing',
    'Hold the fort for a come to jesus moment',
    'Peel the onion to put this one to bed',
    'Pipeline our total quality takeaway',
    'Throw thought leadership over the wall',
    'Try proactive price point onboarding',
    'Manage the low hanging fruit',
    'Leverage our learnings to punch a puppy'
  ]
};
