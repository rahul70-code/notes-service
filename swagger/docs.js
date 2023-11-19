const apiDocumentation = {
    openapi: '3.0.1',
    info: {
      version: '1.3.0',
      title: 'My REST API - Documentation',
      description: 'Description of my API here',
      contact: {
        name: 'Developer name',
        email: 'dev@example.com',
        url: 'https://devwebsite.com',
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
      },
    },
    servers: [
      {
        url: 'http://localhost:6000/',
        description: 'Local Server',
      },
    ],
    tags: [
      {
        name: 'Notes',
      },
    ],
  };
  
  export { apiDocumentation };