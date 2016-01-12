# CSS3 GitHub Material Buttons #

CSS3 GitHub Buttons helps you easily create GitHub-style buttons from links, buttons, and inputs.

This fork replaces all the icons from the [original repo](https://github.com/necolas/css3-github-buttons) with the icons from Google's [Material icons](https://design.google.com/icons/). I was still using Nicolas Gallagher's work in my everyday job, and now that is not maintained anymore, I decided to fork it and replace the limited set of icons that comes with it.

**Example** from original repo: [necolas.github.io/css3-github-buttons/](http://necolas.github.io/css3-github-buttons/)

## Usage

Grab only [`gh-buttons.css`](gh-buttons.css) and [`gh-icons.png`](gh-icons.png) and include the stylesheet in your pages:

    <link rel="stylesheet" href="gh-buttons.css">

### Buttons

The "buttons" can be created by adding `class="button"` to any appropriate `<a>`, `<button>`, or `<input>` element. Add a further class of `pill` to create a button pill-like button. Add a further class of `primary` to emphasise more important actions.

    <a href="#" class="button">Post comment (link)</a>
    <input class="button" type="submit" value="Post comment (input)">
    <button class="button" type="submit">Post comment (button)</button>

### Buttons with dangerous actions

If you have a button that triggers a dangerous action, like deleting data, this can be indicated by adding the class `danger`.

    <a href="#" class="button danger">Delete post</a>

### Big buttons

If you wish to emphasize a specific action you can add the class `big`.

    <a href="#" class="button big">Create Project</a>

### Grouped buttons

Groups of buttons can be created by wrapping them in an element given a class of `button-group`. A less important group of buttons can be marked out by adding a further class, `minor-group`.

    <div class="button-group minor-group">
        <a href="#" class="button primary">Dashboard</a>
        <a href="#" class="button">Inbox</a>
        <a href="#" class="button">Account</a>
        <a href="#" class="button">Logout</a>
    </div>

### Mixed groups

Displaying a mixture of grouped and standalone buttons, as might be seen in a toolbar, can be done by adding another wrapping element with the class `button-container`.

    <div class="actions button-container">
        <a href="#" class="button primary">Compose new</a>

        <div class="button-group">
            <a href="#" class="button primary">Archive</a>
            <a href="#" class="button">Report spam</a>
            <a href="#" class="button danger">Delete</a>
        </div>

        <div class="button-group minor-group">
            <a href="#" class="button">Move to</a>
            <a href="#" class="button">Labels</a>
        </div>
    </div>

### Buttons with icons

Icons can be added (only for links and buttons) by adding a class of `icon` and any one of the Google's [Material icons](https://design.google.com/icons/) names.

    <a href="#" class="button icon search">Search</a>

## Browser compatibility

Firefox 3.5+, Google Chrome, Safari 4+, IE 8+, Opera 10+.

Note: Some CSS3 features are not supported in older versions of Opera and versions of Internet Explorer prior to IE 8. The use of icons is not supported in IE 6 or IE 7.

## Build


If you want to build [`gh-buttons.css`](gh-buttons.css) and [`gh-icons.png`](gh-icons.png) yourself, you have to fetch Git submodules for [Material icons](https://design.google.com/icons/) and [zopfli](https://github.com/google/zopfli) and then use the [`build.js`](build.js) Node.js script:

    git submodule init && git submodule update
    cd zopfli && make zopflipng && cd .. # Compile zopflipng
    npm install async sprity lwip # Install build script dependencies
    node build.js

The script creates the PNG sprite sheet using all icons from the Google's submodule and edits the CSS style sheet accordingly. In the first lines of [`build.js`](build.js) there are some variables you can use to customize your build, like the `cssPath` used to reference the PNG sprite in the CSS (e.g. '../images').

## License

[Public domain](http://unlicense.org), except Google's Material icons (and so [`gh-icons.png`](gh-icons.png)) that are licensed under [CC-BY license](https://creativecommons.org/licenses/by/4.0/).

## Acknowledgements

Inspired by [Michael Henriksen](http://michaelhenriksen.dk)'s [CSS3 Buttons](http://github.com/michenriksen/css3buttons).  
Forked from [Nicolas Gallagher](https://github.com/necolas)'s [repo](https://github.com/necolas/css3-github-buttons).  
Icons from Google's [Material icons](https://design.google.com/icons/).
