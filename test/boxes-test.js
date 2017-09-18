var tape = require("tape"),
    boxes = require("../");

tape("boxes() returns the answer to the ultimate question of life, the universe, and everything.", function(test) {
  test.equal(boxes.boxes(), 42);
  test.end();
});
