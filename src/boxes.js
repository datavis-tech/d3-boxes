export default function boxes(layout, sizes, box){
  var result = {},
      isHorizontal,
      wiggleRoom,
      sizeSum = 0,
      x,
      y,
      visibleChildren;

  box.x = box.x || 0;
  box.y = box.y || 0;
  sizes = sizes || {};

  function size(layout){
    var result, alias;
    if(isLeafNode(layout)){
      alias = layout;
      if(alias in sizes){
        result = sizes[alias].size;
      } else {
        result = 1;
      }
    } else {
      result = layout.size || 1;
    }
    if(typeof result === "string" && ! isPixelCount(result)){
      result = parseFloat(result);
    }
    return result;
  }

  function isVisible(layout) {
    if(isLeafNode(layout) && (layout in sizes)){
      return !sizes[layout].hidden;
    } else {
      return true;
    }
  }

  if(isLeafNode(layout)){
    result[layout] = {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height
    };
  } else {
    isHorizontal = layout.orientation === "horizontal";
    wiggleRoom = isHorizontal ? box.width : box.height;
    visibleChildren = layout.children.filter(isVisible);
    visibleChildren.forEach(function (child) {
      if(isPixelCount(size(child))){
        wiggleRoom -= pixelCount(size(child));
      } else {
        sizeSum += size(child);
      }
    });
    x = box.x;
    y = box.y;
    visibleChildren.forEach(function (child) {
      var childBox = { x: x, y: y},
          childSize = size(child),
          sizeInPixels;

      if(isPixelCount(childSize)){
        sizeInPixels = pixelCount(childSize);
      } else {
        sizeInPixels = (childSize / sizeSum) * wiggleRoom;
      }

      if(isHorizontal){
        childBox.width = sizeInPixels;
        childBox.height = box.height;
        x += childBox.width;
      } else {
        childBox.width = box.width;
        childBox.height = sizeInPixels;
        y += childBox.height;
      }

      quantize(childBox);

      if(isLeafNode(child)){
        result[child] = childBox;
      } else {
        var childResult = boxes(child, sizes, childBox);
        if (child.name) {
          result[child.name] = childBox;
          result[child.name].nonleaf = true;
        }
        Object.keys(childResult).forEach(function (alias){
          result[alias] = childResult[alias];
        });
      }
    });
  }
  return result;
};

// Determines whether the given node in the layout tree
// is a leaf node or a non-leaf node.
function isLeafNode(layout){

  // If it is a leaf node, then it is a string
  // that is interpreted as a component alias.
  return typeof layout === "string";
}

function isPixelCount(size){
  return (typeof size === "string") && endsWith(size, "px");
}

// http://stackoverflow.com/questions/280634/endswith-in-javascript
function endsWith(str, suffix){
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function pixelCount(size){
  return parseInt(size.substr(0, size.length - 2));
}

function quantize(box){
  var x = Math.round(box.x),
      y = Math.round(box.y);
  box.width = Math.round(box.width + box.x - x);
  box.height = Math.round(box.height + box.y - y);
  box.x = x;
  box.y = y;
}
