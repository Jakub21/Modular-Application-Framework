# Modular Application Framework
For Node.js

### Description
MAF allows for easy integration of various modules. Some common features of any web application are already wrapped into MAF modules and are shipped with the package. These can then be molded together into an application with user-made modules.

## Setup
- To use MAF first install it from the NPM
  ```bash
  npm install @jakub21/maf
  ```
- Import it in your entry point file (ex. `index.js`)
  ```javascript
  const maf = require('@jakub21/maf');
  ```
- Create config instance. The default configuration is loaded from inside the package, so if you don't need to overwrite anything you don't have to provide any file.
  ```javascript
  let config = new maf.Config();
  config.loadFile('./config.yml'); // optional
  ```
- Create an app that will manage all modules.
  ```javascript
  let config = new maf.Application(config);
  ```
- Load a builtin module. This loads an `express` module with functional http server inside. If you ever need it, this method will return the module instance. Some builtins require additinal parameters.
  ```javascript
  app.builtin('express');
  ```
- Load your own module. You can pass parameters and just like before, this method will return the module instance. The path is relative to your entry point script.
  ```javascript
  let banana = app.module('./banana.js', 235, 'yellow');
  ```

## Creating your own modules
- Each module has to inherit from `MafModule` class. The file it is located in must expose the class as the only export.
  ```javascript
  let {MafModule} = require('@jakub21/maf');

  module.exports = class Banana extends MafModule {...}
  ```
- Constructor receives the `Application` instance as the first parameter. You are free to add more.
  ```javascript
  constructor(app, weight, color) {...}
  ```
- The first thing you do in the constructor should be a `super` call with the above mentioned Application instance and a module name. The name has no formal constrains but to keep the framework convention you are encouraged to use lowercase letters only. The name is used as config scope and logs issuer.
  ```javascript
  constructor(app, weight, color) {
    super(app, 'banana');
  }
  ```
- Log entries are added to default app logger with the log method. See logging section for more details.
  ```javascript
  this.log(`Color is ${color} and weight is ${weight}g`);
  ```
  With the default settings this produces the following entry:
  ```
  [09:34:21] <banana> Color is yellow and weight is 235g
  ```

## Configuration

## Logging

## Inter-module integration

## Builtins
