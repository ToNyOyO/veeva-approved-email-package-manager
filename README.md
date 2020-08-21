# Veeva Approved Email - Package manager 

## File structure

You'll need to make the following file structure which can be done by running `$ gulp setup`: 

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

## Making a fragment 

This VAE packaging system requires that images in your fragment are loaded from `root`>`images`. Remember that fragments in Veeva always use a table format and the content is always encapsulated in `<tr></tr>`. 

```
<tr>
  <td width="20"></td>
  <td width="610">
  
    <img alt="This is an image" src="images/your-image-name.png" width="200px" height="50px" style="display:block;border:0;" />
  
  </td>
  <td width="20"></td>
</tr>
```

## Gulp Tasks and Workflow

### Overview

```
TASKS
_________________________________________________________________________

$ gulp                                        Watch src folder for changes
$ gulp setup                                  Setup folder structure
$ gulp build                                  Build task
$ gulp dist                                   Deploy task
```

### In depth

```
$ gulp setup
```
Create the project folder structure

```
$ gulp
```
Watch the `fragments`, `images`, and `template` file for changes and run the `build` command.

```
$ gulp build
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
