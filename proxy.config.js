const proxy = [
  {
    context: '/estudantes/cadastro',
    target: 'https://www.flickr.com/services/oauth/request_token'
    // pathRewrite: {'^/api' : ''}
  }
];
module.exports = proxy;
