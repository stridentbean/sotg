module.exports = {
  test: {
    db: {
      user : 'root',
      password : '',
      host : '127.0.0.1', 
      database: 'test'
    }
  },
  development: {
    db: {
      user: 'root',
      password: '',
      host: '127.0.0.1',
      database: 'sotg'
    }
  },
  circleci: {
    db: {
      user: 'ubuntu',
      password: '',
      host: '127.0.0.1',
      database: 'circle_test'
    }
  }
};
