# Veeva Approved Email - Package manager 

## File structure

You'll need to make the following folder structure which can be done by running `$ gulp setup`: 

```
root/
|—— build/
|—— dist/
|—— src/
|   |—— fragments/
|   |—— images/
|   |—— template/
|
|—— gulfile.js
|—— package.json
```

The `template` folder will contain you Veeva Approved Email template. It doesn't matter what your `html` file is called. 

Each fragment needs to go in its own folder in `fragments`. You should give your fragment `html` files sensible, relevant names. 

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
$ gulp fragment --new "Fragment name"         Create a new fragment
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

Template images obviously go into `images`>`template`. 

```
root/
|—— src/
|   |—— images/
|   |   |—— template/
|   |   |   |—— an-image.png
|   |   |   |—— another-image.jpg
|   |—— template/
|   |   |—— your-template.html
```

```
$ gulp
```
Watch the `fragments`, `images`, and `template` files for changes and run the `build` command automatically. 

You may like to implement something to refresh your browser when this command runs but I prefer to press F5 myself. Here's an example of how to implement a live reload if that's what you're into: <https://stackoverflow.com/questions/43415506/how-to-make-a-refresh-in-browser-with-gulp/43463567>

```
$ gulp fragment --new "Fragment name"
```
This will create an empty fragment `html` file in fragments and an empty images folder in images with the same name. 

```
root/
|—— src/
|   |—— images/
|   |   |—— your-new-fragment/
|   |—— fragments/
|   |   |—— your-new-fragment.html
```

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
