# d3-boxes
Nested box layout for use with D3 visualizations. Check out this [example](https://bl.ocks.org/curran/ad6d4eaa6cf39bf58769697307ec5f3a)!

[![image](https://user-images.githubusercontent.com/68416/31494037-44898766-af6f-11e7-95a1-57a04c0a9a81.png)](https://bl.ocks.org/curran/ad6d4eaa6cf39bf58769697307ec5f3a)


The above nested box structure can be configured like this:

```js
var layout = {
  orientation: "vertical",
  children: [
    "A",
    {
      orientation: "horizontal",
      children: [
        "B",
        "C"
      ],
      size: 2 // Make this layer have a size weight of 2 (default is 1)
    },
    "D"
  ]
};

var sizes = {
  A: {
    size: 2 // Make the "A" box have a size weight of 2 (default is 1)
  }
};

var box = {
  width: 960,
  height: 500
};

var boxes = d3.boxes(layout, sizes, box);
```
For more context, see the [full example code](https://bl.ocks.org/curran/ad6d4eaa6cf39bf58769697307ec5f3a).

The following features are also present:

 * Specifying relative (proportions to siblings) or absolute (fixed number of
   pixels) size of any node in the layout tree. Relative size makes sense for
   resizable visualizations, while absolute size makes sense for conventional UI
   widgets that only look good at a specific size in terms of pixels. To use
   this feature, specify size as a string ending in "px".

 * Toggling visibility of components. When a component is marked as "hidden", it
   is excluded from the layout algorithm. This could be used to, for example,
   hide and show the JSON configuration editor when the user clicks on a
   "settings" button. To use this feature, add `{ hidden : true }` to the
   `sizes` configuration.

## Installing

If you use NPM, `npm install d3-boxes`. Otherwise, download the [latest release](https://github.com/d3/d3-boxes/releases/latest).

## API Reference

<a href="#boxes" name="boxes">#</a> <b>boxes</b>(layout, sizes, box)

This function computes the nested box layout from a tree data structure.

Takes as input the following arguments:

* `layout` A tree data structure defining nested boxes. The root
  of the tree may be either a leaf node or an internal node.
  * Leaf nodes are component alias strings.
  * Internal nodes are objects with the following properties:
    * `orientation` A string, either
      * "horizontal", meaning this node is subdivided horizontally
        with children placed from left to right, or
      * "vertical", meaning this node is subdivided vertically
        with children placed from top to bottom.
    * `children` An array of child node objects, each of which may be 
      either a leaf node or internal node.
    * `size` The size of the internal node, with the same specifications
      as values within `sizes` (see next bullet point).
* `sizes` An object that specifies component size options, where
  * Keys are component alias strings.
  * Values are objects with the following properties:
    * `size` the width (if the containing box is horizontal)
      or height (if the containing box is vertical) of the component.
      May be either:
      * a number (like "1.5" or "1", expressed as a number or a string) that 
      determines size relative to siblings within the containing box, or
      * a count of pixels (like "50px" or "200px" expressed as a string 
        with "px" suffix) that determines an absolute fixed size.
        This is useful in cases where components have fixed-size UI widgets 
        rather than flexibly resizable visualizations.
      * If `size` is not specified, it is assigned a default value of 1.
    * `hidden` A boolean for hiding components. If true, the component
      is excluded from the layout, if false the component is included.
* `box` An object describing the outermost box of the layout,
  with the following properties:
  * `width` The width of the box in pixels.
  * `height` The height of the box in pixels.
  * `x` The X offset of the box in pixels.
    If not specified, this defaults to zero.
  * `y` The Y offset of the box in pixels.
    If not specified, this defaults to zero.

Returns an object where

 * Keys are component aliases.
 * Values are objects representing the computed box for the component,
   having the following integer properties:
  * `x` The X offset of the box in pixels.
  * `y` The Y offset of the box in pixels.
  * `width` The width of the box in pixels.
  * `height` The height of the box in pixels.
  * These box dimensions are quantized from floats to ints such that there are no gaps.

