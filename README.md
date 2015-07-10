# Project Name

> Pithy project description

## Team

  - __Product Owner__: teamMember
  - __Scrum Master__: teamMember
  - __Development Team Members__: teamMember, teamMember

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Contributing](#contributing)
1. [Style Guide](#style-guide)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)

## Usage

> Some usage instructions

## Requirements

- Node 0.10.x
- mysql

Please create a file server/db/config.js and model it after server/db/configExample.js 

## Contributing
1. Fork
1. Create namespaced feature branch from master
  - bug/...
  - feat/...
  - test/...
  - dock/...
  - refactor/...
1. Make commits to feature branch. Prefix each commit like so:
  - (feat) Add a new feature
  - (fix) Fix inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...
1. When you've finished with your fix or feature
  - Rebase upstream changes into your branch.
  - Submit a pull request directly to master. Include description of changes.
  - Your pull request will be reviewed by another maintainer.
  - Fix any issues raised by reviewer and push fixes as single commit.
  - Once pull request has been reviewed, it will be merged by another member. Do not merge yoru own commits. 

## Style Guide
- Two space indents
- Newline at end of file
- Not specified above: [Crockford's Style](http://javascript.crockford.com/code.html)

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Docker

- If you're using Mac, you'll have to install boot2docker and docker: https://docs.docker.com/installation/mac/
- Download the [Boot2Docker-x.x.x.pkg](https://github.com/boot2docker/osx-installer/releases/tag/v1.7.0) file.
- Install Boot2Docker by double-clicking the package.
  - The installer places Boot2Docker and VirtualBox in your "Applications" folder.
  - The ``docker`` and ``boot2docker`` binaries will be in your ``/usr/local/bin`` directory.
- __To run docker from the command line__
  1. Create a new Boot2Docker virtual machine
    - ``boot2docker init``
  2. Start the ``boot2docker`` VM.
    - ``boot2docker start``
  3. Display the environment variables for the Docker client.
    - ``boot2docker shellinit``
  4. Set the environment variables in your shell with the following:
    - ``$(boot2docker shellinit)``
  5. Run the hello-world container to verify your setup.
    - ``docker run hello-world``
    
### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
