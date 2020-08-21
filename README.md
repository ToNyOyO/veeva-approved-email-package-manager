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
Create the project folder structure:

```
root/
|—— build/
|—— dist/
|—— src/
|   |—— fragments/
|   |—— images/
|   |—— template/
```

It's up to you to make your own html files. The template filename doesn't matter, anything will do as long as it's a sensible file name. 

When adding images for a fragment, you need to put those images in a folder with the fragment name. The image name doesn't matter: 

```
root/
|—— src/
|   |—— fragments/
|   |   |—— fragment-name-1.html
|   |—— images/
|   |   |—— fragment-name-1/
|   |   |   |—— an-image.png
|   |   |   |—— another-image.jpg
```

Template images obviously go in a folder named `template`. 

```
$ gulp
```
Watch the `fragments`, `images`, and `template` files for changes and run the `build` command automatically. 

You may like to implement something to refresh your browser when this command runs but I prefer to press F5 myself. Here's an example of how to implement a live reload if that's what you're into: <https://stackoverflow.com/questions/43415506/how-to-make-a-refresh-in-browser-with-gulp/43463567>

```
$ gulp build
```
*All files and folders in `build` will be erased before this command runs*

Convert the fragments and template into a single `html` file for local testing: 

```
root/
|—— build/
|   |—— images/
|   |   |—— all.png
|   |   |—— the.png
|   |   |—— imgs.png
|   |—— template-with-embedded-fragments.html
```

- Compile the images into `build`>`images`
- Compile the fragments into the template to create a single `html` file which can be viewed in a web browser 
- Place the compiled `html` file in the `build` folder

```
$ gulp dist
```
*All files and folders in `dist` will be erased before this command runs*

Package the template and fragments in accordance with Veeva requirements: 

```
root/
|—— dist/
|   |—— fragment-name-1/
|   |   |—— images.zip
|   |   |—— index.html
|   |—— fragment-name-2/
|   |   |—— images.zip
|   |   |—— index.html
|   |—— template/
|   |   |—— images.zip
|   |   |—— index.html
```

- Copy the template into `dist`>`template` and rename to `index.html`
- Copy all the template images into an images folder, and into `images.zip` 

- Copy each fragment into `dist`>`fragment-name` and rename to `index.html`
- Copy all the fragment images into an images folder, and into `images.zip`, for each fragment 
