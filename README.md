```
                        :DNMMMMMMMMN$.                       
                . =NMMMMMMMMMMMMMMMMMMMMD.                  
              .DMMMMMMMMMMMMMMMMMMMMMMMMMMMN..              
            ,MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMD.            
          .NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM8           
         NMMMMMMMMNNMMMMMMMMMMMMMNNNNNNNNNNMMMMMMN.         
       .NMMMMMMMMM  ..NNMMMMMMMMM.      ..MMMMMMMMM~        
       MMMMMMMMMMMN     ,MMMMMMMM~      .:MMMMMMMMMM.       
      DMMMMMMMMMMMN        DMMMMMN        MMMMMMMMMMM..     
     .MMMMMMMMMMMM7           DMM. 8NNNNNNNMMMMMMMMMMN.     
     DMMMMMMMMMMMM.  .            NMMMMMMMMMMMMMMMMMMM      
     NMMMMMMMMMMMM   MMM,..        $MMMMMMMMMMMMMMMMMM.     
    .NMMMMMMMMMMMM  NMMMMMM~          +MMMMMMMMMMMMMMM.     
     DMMMMMMMMMMMMN NMMMMMMMNM..       . DMMMMMMMMMMMM.     
     .MMMMMMMMMMMMN .MMMMMMMMMMMN.        .MMMMMMMMMMN      
      NMMMMMMMMMMMD   ...  MMMMMMMMN      IMMMMMMMMMM.      
      .NMMMMMMMMMM~        MMMMMMMMMMMZ   .MMMMMMMMM$       
       .MMMMMMMMMM.        NMMMMMMMMMMMMM, NMMMMMMMD        
         NMMMMMMMI..........MMMMMMMMMMMMMMMMMMMMMNI         
          8NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN.          
          . DMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMN..           
              .NNMMMMMMMMMMMMMMMMMMMMMMMMMMMN               
                ..NMMMMMMMMMMMMMMMMMMMMMM8                  
                     .INMMMMMMMMMMMND

              H T Z - F R O N T E N D  C L I

```


# @haaretz/htz-frontend-cli
> yarn workspaces autocompletion for htz-frontend

This package provides a simple cli for easing the pains of working in a monorepo
managed by Yarn Workspace. Its basic philosopy is to minimize typing to a minimum
while maintaining clarity, as well as providing helpful suggestions through 
tab-completions. It is tested to work with `bash`, `zsh` and `fish`.

## Installation

Install the package _globally_ with npm:

```
npm install --global @haaretz/htz-frontend-cli`
```

or Yarn:
```
yarn global add @haaretz/htz-frontend-cli`
```



## Setup

Once installed, a global `htz` command will be available in your path.

To configure your `htz-frontend` project directory and install shell completions,
run `htz --setup`, which will open a short wizard that will guide you through the
process.

If, for any reason, you would like to edit your config at any point in the future, 
the recommended way to do so is simply by running `htz --setup` again. Alternatively,
you can manually edit `$HOME/.config/htz/.htzrc.js`.

## Usage

Once set up you can run `htz` from anywhere on your system, and it will carry 
execute commands in the project. If you hit tab, it will also try and make helpful
completion suggestions based your input.

### Global Repository Actions

When the first argument to `htz` is one of `add`, `remove` or `run`, the action
in the following arguments will be executed in each and every package in the 
repository.

For instance, `htz remove lodash` will remove the lodash dependency from every 
package in the repository where it is installed. Similarly, `add` will install 
packages, and run will run a task defined in `scripts` property of the individual 
packages' `package.json`.

### Package Specific Actions

When the first argument is a package name (sans the `@haaretz/` scope prefix), 
the action in the following arguments will be executed in that individual package.

Package names are suggested as tab completion candidates, so `htz htz-c->` will
suggest `htz-components`, `htz-css-tools` and every other package that starts 
with `htz-c` as completion candidates.

In turn, once a packages is chosen, the tasks specified in the `scripts` property 
of its `package.json` will be offered as completion candidates. 
E.g., `htz htz-theme sty->` will suggest `styleguide` and `styleguide:theme` as 
completion candidates.

`add` and `remove` are also suggested, and remove is followed by all installed
dependencies (dev, peer, and otherwise) as completion candidates. E.g.,
`htz htz-theme remove lo->` will suggest `lodash` as completion candidates.

### Non Default Directory

As mentioned above, by default, actions are executed in the configured project
directory, however, it may sometimes be expedient to have two distinct project
directories on the same system, for instance when using git's `work-tree` 
feature.

For that purpose, when the first argument to `htz` is `cwd`, actions will be 
executed in the current working directory instead of the preconfigured project
directory.

For example, 
```sh
~/second-copy-of-htz-frontend$ htz cwd htz-c->
```
will suggest packages from that directory starting with `htz-c` and run the chosen actions locally inside it. All other aspects of `htz` remain unchanged.
