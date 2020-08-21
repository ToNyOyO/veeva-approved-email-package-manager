# Veeva Approved Email - Package manager 

## File structure

You'll need to make the following file structure which can be done by running `$gulp setup`: 

```
root/
|—— build/
|—— dist/
|—— src/
|   |—— fragments/
|   |   |—— fragment-name-1.html
|   |   |—— fragment-name-2.html
|   |—— images/
|   |   |—— fragment-name-1/
|   |   |   |—— fragment-1-images.png
|   |   |—— fragment-name-2/
|   |   |   |—— fragment-2-images.png
|   |   |—— template/
|   |   |   |—— template-images.png
|   |—— template/
|   |   |—— template-name.html
|
|—— gulfile.js
|—— package.json
```

## Including fragments in the template for testing

Frgaments are injected into the template using the following method. This is only for the purpose of testing the email (with all fragments) in a web browser or, for example, uploading to Litmus for email client testing. 

```
<table>
  <!-- inject:../fragments/fragment-name-1.html -->
  <!-- endinject -->

  <!-- inject:../fragments/fragment-name-2.html -->
  <!-- endinject -->

  {{insertEmailFragments[1,5]}}
</table>
```

## Gulp Tasks and Workflow

### Overview

```
TASKS
_________________________________________________________________________

$ gulp                                        Build task 
$ gulp setup                                  Setup folder structure
$ gulp dist                                   Deploy task
```

### In depth

```
$ gulp 
```
Convert the fragments and template into a single `html` file for local testing: 
- Compile the images into `build`>`images`
- Compile the fragments into the template to create a single `html` file which can be viewed in a web browser 
- Place the compiled `html` file in the `build` folder

```
$ gulp dist
```
Package the template and fragments in accordance with Veeva requirements: 
- Copy the template into `dist`>`template`
- Copy the template images into `dist`>`template`>`images.zip`
- Copy each fragment into `dist`>`fragment-name`
- Copy each fragment's images into `dist`>`fragment-name`>`images.zip`
