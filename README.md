# HERE'S WHAT'S WAT #

## What is this repository for? ##

This is the default starting grunt stack for a front-end project at Reingold. It includes bootstrap-sass, wiredep, bower, modernizr, browsersync, eslint, sass compiling, and babel compiling.

## How do I get set up? ##

Clone the repo and run
```javascript

npm install && bower install

```

To run the local server use

```
```javascript

grunt serve

```

To run the build process and output to dist

```
```javascript

grunt build

```

## Code Structure ##

### The gruntfile currently requires a common, specific code structure: ###

**src**  
-**styles**  
--main.scss  
-**scripts**  
--main.js  
--**vendor**  
-**images**  

### Scss files should be in category directories within styles like this: ###

**styles**  
-main.scss  
-**components**  
--_component-1.scss  
--_component-2.scss  
-**blocks**  
--_block-1.scss  
--_block-2.scss  

### Vendor js files should be in a vendor folder inside scripts like this: ###

**scripts**  
-main.js  
-**vendor**  
--plugin.js  
--other-plugin.js  

## How do I add plugins? ##

Install Bower packages with 'bower install --save package-name'. Using the '--save' flag will add the package into your project's bower.json dependencies.
