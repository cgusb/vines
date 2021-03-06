let preset = 'square';
let nSeeds = 3;
// Probability of a vine growing in a frame
let probGrow = 0.5;
// Probability of vine growing a certain direction: [top left, top middle, top right]. Must sum to 1
let probDir = [0.25, 0.5, 0.25];
// Probability that a growing vine will branch
let probBranch = 0.03;
// Probability of a growing vine to stop growing
let probStop = 0.01;
// Array containing coordinates [row, col] of vine fronts (nodes) on canvas
let growNodes = [];
let fps = 5;
let bg = [200, 80, 50];
let vineColor = [75, 200, 50];
let nCols;
let nRows;
// Set true to save GIF animation
// let save = true;
let save = false;
let wait = 0;
let nFrames = 100;
const [nPixelsRow, nPixelsCol, res] = presets(preset);

function presets(name) {
  let nPixelsRow;
  let nPixelsCol;
  let res;
  let margins;
  if (name == 'square') {
    nPixelsRow = 1000;
    nPixelsCol = 1000;
    res = 10;
  }
  return [nPixelsRow, nPixelsCol, res];
}

function setup() {
  createCanvas(nPixelsCol, nPixelsRow);
  frameRate(fps);
  nRows = height / res;
  nCols = width / res;
  background.apply(null, bg);
  for (let i = 0; i < nSeeds; i++) { 
    node = [nRows - 1, getRandomInt(nCols)];
    if (!growNodes.includes(node)) {
      growNodes.push(node);
    }
  }
  console.log('End of setup()')
}

function keyPressed() {
  // Set spacebar to toggle play/pause of drawing loop
  if (key === ' ') {
    if (isLooping()) {
      noLoop();
      console.log('STOPPED. Press SPACE to resume.')
    } else {
      loop();
      console.log('RESUMED. Press SPACE to stop.')
    }
  }
  if (key === 'r') {
    reset();
  }
}

function draw() {
  console.log(`Frame ${frameCount - 1}`)
  // Iterate through array of nodes (growNodes) backwards so that nodes can be replaced (and new nodes can be appended when branching is added)
  for (let i = growNodes.length - 1; i >= 0; i--) {
    let node = growNodes[i];
    // Draw
    // -------------------------------------------------------------------------
    noStroke();
    fill.apply(null, vineColor);
    rect(res * node[1], res * node[0], res, res);
    // Check if node should stop growing
    // -------------------------------------------------------------------------
    let isStopping = Math.random() < probStop;
    if (isStopping) {
      console.log(`Node stopping at ${{node}}`);
      growNodes.splice(i, 1);
    }
    // Grow
    // -------------------------------------------------------------------------
    let isGrowing = Math.random() < probGrow;
    if (isGrowing) {
      let probVal = Math.random();
      let growDir;
      switch (true) {
        case (probVal < probDir[0]):
          growDir = -1;
          break;
        case (probDir[0] <= probVal && probVal < probDir[0] + probDir[1]):
          growDir = 0;
          break;
        default:
          growDir = 1;
      }
      growNodes.splice(i, 1, [node[0] - 1, node[1] + growDir]);
      // Branching
      // -----------------------------------------------------------------------
      let isBranching = Math.random() < probBranch;
      if (isBranching) {
        console.log(`Node branching at ${{node}}`);
        // dirs will be possible direction to branch
        let dirs = [-1, 0, 1];
        // Remove the direction the previous node grew in (growDir) from the available options of the branch
        let growDirIdx = dirs.indexOf(growDir);
        dirs.splice(growDirIdx, 1);
        // Pick one of the available growing directions (dirs) at random
        branchDir = dirs[Math.floor(2 * Math.random())];
        growNodes.push([node[0] - 1, node[1] + branchDir]);
      }
    }
  }
  // if save is true, save frames
  if (save && frameCount - 1 < nFrames) saveCanvas(
    `frame_${('000' + frameCount).slice(-3)}`
  );
}
