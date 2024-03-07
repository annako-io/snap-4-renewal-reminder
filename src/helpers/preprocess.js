/**
 * P5.js - Image preprocessing techniques from P5.js Library
 * Link: https://github.com/processing/p5.js/blob/main/src/image/filters.js
 * 
 */

function preprocessImage(canvas) {
  const level = 0.5; // Also tried 0.4
  const radius = 1;
  const ctx = canvas.getContext('2d');
  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  blurARGB(image.data, canvas, radius); // confidence: 30
  dilate(image.data, canvas); // confidence: 37; b&d: 38; d&i: 
  // invertColors(image.data); // confidence: 34; b&i: 36; d&i: 39,34
  // thresholdFilter(image.data, level);
  thresholdFilter(image.data, level); // thres only: 20, 33; bdi: 
  return image;
}

/**
 * Converts the image to black and white pixels depending if they are above or
 * below the threshold defined by the level parameter. The parameter must be
 * between 0.0 (black) and 1.0 (white). If no level is specified, 0.5 is used.
 *
 * Borrowed from http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
 *
 * @param  {Canvas} canvas Canvas to apply thershold filter on.
 * @param  {Float} level Threshold level (0-1).
 */
function thresholdFilter(pixels, level) {
  if (level === undefined) {
    level = 0.5;
  }
  // Calculate threshold value on a (0-255) scale
  const thresh = Math.floor(level * 255);
  for (let i = 0; i < pixels.length; i += 4) {
    const red = pixels[i];
    const green = pixels[i + 1];
    const blue = pixels[i + 2];
    // CIE luminance for RGB
    const gray = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    let value;
    if (gray >= thresh) {
      value = 255;
    } else {
      value = 0;
    }
    pixels[i] = pixels[i + 1] = pixels[i + 2] = value; // set pixel to value
  }
}

/**
 * Modifies pixels RGBA values to values contained in the data object.
 *
 * @param {Uint8ClampedArray} pixels array returned by _toPixels()
 * @param {Int32Array}        data   source 1D array where each value
 *                                   represents ARGB values
 */
function setPixels(pixels, data) {
  let offset = 0;
  for (let i = 0, al = pixels.length; i < al; i++) {
    offset = i * 4;
    pixels[offset + 0] = (data[i] & 0x00ff0000) >>> 16;
    pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
    pixels[offset + 2] = data[i] & 0x000000ff;
    pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
  }
};

/**
* Returns a 32-bit number containing ARGB data at the ith pixel in the
* 1D array containing pixels data.
*
* @param  {Uint8ClampedArray} data array returned by _toPixels()
* @param  {Integer}           i    index of a 1D Image Array
* @return {Integer}                32-bit integer value representing
*                                  ARGB value.
*/
function getARGB(data, i) {
  const offset = i * 4;
  return (
    ((data[offset + 3] << 24) & 0xff000000) |
    ((data[offset] << 16) & 0x00ff0000) |
    ((data[offset + 1] << 8) & 0x0000ff00) |
    (data[offset + 2] & 0x000000ff)
  );
};

// internal kernel stuff for the gaussian blur filter
let blurRadius;
let blurKernelSize;
let blurKernel;
let blurMult;

/*
 * Port of https://github.com/processing/processing/blob/
 * main/core/src/processing/core/PImage.java#L1250
 *
 * Optimized code for building the blur kernel.
 * further optimized blur code (approx. 15% for radius=20)
 * bigger speed gains for larger radii (~30%)
 * added support for various image types (ALPHA, RGB, ARGB)
 * [toxi 050728]
 */
function buildBlurKernel(r) {
  let radius = (r * 3.5) | 0;
  radius = radius < 1 ? 1 : radius < 248 ? radius : 248;

  if (blurRadius !== radius) {
    blurRadius = radius;
    blurKernelSize = (1 + blurRadius) << 1;
    blurKernel = new Int32Array(blurKernelSize);
    blurMult = new Array(blurKernelSize);
    for (let l = 0; l < blurKernelSize; l++) {
      blurMult[l] = new Int32Array(256);
    }

    let bk, bki;
    let bm, bmi;

    for (let i = 1, radiusi = radius - 1; i < radius; i++) {
      blurKernel[radius + i] = blurKernel[radiusi] = bki = radiusi * radiusi;
      bm = blurMult[radius + i];
      bmi = blurMult[radiusi--];
      for (let j = 0; j < 256; j++) {
        bm[j] = bmi[j] = bki * j;
      }
    }
    bk = blurKernel[radius] = radius * radius;
    bm = blurMult[radius];

    for (let k = 0; k < 256; k++) {
      bm[k] = bk * k;
    }
  }
}

function blurARGB(pixels, canvas, radius) {
  const width = canvas.width;
  const height = canvas.height;
  const numPackedPixels = width * height;
  const argb = new Int32Array(numPackedPixels);
  for (let j = 0; j < numPackedPixels; j++) {
    argb[j] = getARGB(pixels, j);
  }
  let sum, cr, cg, cb, ca;
  let read, ri, ym, ymi, bk0;
  const a2 = new Int32Array(numPackedPixels);
  const r2 = new Int32Array(numPackedPixels);
  const g2 = new Int32Array(numPackedPixels);
  const b2 = new Int32Array(numPackedPixels);
  let yi = 0;
  buildBlurKernel(radius);
  let x, y, i;
  let bm;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      read = x - blurRadius;
      if (read < 0) {
        bk0 = -read;
        read = 0;
      } else {
        if (read >= width) {
          break;
        }
        bk0 = 0;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (read >= width) {
          break;
        }
        const c = argb[read + yi];
        bm = blurMult[i];
        ca += bm[(c & -16777216) >>> 24];
        cr += bm[(c & 16711680) >> 16];
        cg += bm[(c & 65280) >> 8];
        cb += bm[c & 255];
        sum += blurKernel[i];
        read++;
      }
      ri = yi + x;
      a2[ri] = ca / sum;
      r2[ri] = cr / sum;
      g2[ri] = cg / sum;
      b2[ri] = cb / sum;
    }
    yi += width;
  }
  yi = 0;
  ym = -blurRadius;
  ymi = ym * width;
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      cb = cg = cr = ca = sum = 0;
      if (ym < 0) {
        bk0 = ri = -ym;
        read = x;
      } else {
        if (ym >= height) {
          break;
        }
        bk0 = 0;
        ri = ym;
        read = x + ymi;
      }
      for (i = bk0; i < blurKernelSize; i++) {
        if (ri >= height) {
          break;
        }
        bm = blurMult[i];
        ca += bm[a2[read]];
        cr += bm[r2[read]];
        cg += bm[g2[read]];
        cb += bm[b2[read]];
        sum += blurKernel[i];
        ri++;
        read += width;
      }
      argb[x + yi] =
        ((ca / sum) << 24) |
        ((cr / sum) << 16) |
        ((cg / sum) << 8) |
        (cb / sum);
    }
    yi += width;
    ymi += width;
    ym++;
  }
  setPixels(pixels, argb);
}

/**
 * Increases the bright areas in an image.
 * @param  {Canvas} canvas
 */
function dilate(pixels, canvas) {
  let currIdx = 0;
  const maxIdx = pixels.length ? pixels.length / 4 : 0;
  const out = new Int32Array(maxIdx);
  let currRowIdx, maxRowIdx, colOrig, colOut, currLum;

  let idxRight, idxLeft, idxUp, idxDown;
  let colRight, colLeft, colUp, colDown;
  let lumRight, lumLeft, lumUp, lumDown;

  while (currIdx < maxIdx) {
    currRowIdx = currIdx;
    maxRowIdx = currIdx + canvas.width;
    while (currIdx < maxRowIdx) {
      colOrig = colOut = getARGB(pixels, currIdx);
      idxLeft = currIdx - 1;
      idxRight = currIdx + 1;
      idxUp = currIdx - canvas.width;
      idxDown = currIdx + canvas.width;

      if (idxLeft < currRowIdx) {
        idxLeft = currIdx;
      }
      if (idxRight >= maxRowIdx) {
        idxRight = currIdx;
      }
      if (idxUp < 0) {
        idxUp = 0;
      }
      if (idxDown >= maxIdx) {
        idxDown = currIdx;
      }
      colUp = getARGB(pixels, idxUp);
      colLeft = getARGB(pixels, idxLeft);
      colDown = getARGB(pixels, idxDown);
      colRight = getARGB(pixels, idxRight);

      //compute luminance
      currLum =
        77 * ((colOrig >> 16) & 0xff) +
        151 * ((colOrig >> 8) & 0xff) +
        28 * (colOrig & 0xff);
      lumLeft =
        77 * ((colLeft >> 16) & 0xff) +
        151 * ((colLeft >> 8) & 0xff) +
        28 * (colLeft & 0xff);
      lumRight =
        77 * ((colRight >> 16) & 0xff) +
        151 * ((colRight >> 8) & 0xff) +
        28 * (colRight & 0xff);
      lumUp =
        77 * ((colUp >> 16) & 0xff) +
        151 * ((colUp >> 8) & 0xff) +
        28 * (colUp & 0xff);
      lumDown =
        77 * ((colDown >> 16) & 0xff) +
        151 * ((colDown >> 8) & 0xff) +
        28 * (colDown & 0xff);

      if (lumLeft > currLum) {
        colOut = colLeft;
        currLum = lumLeft;
      }
      if (lumRight > currLum) {
        colOut = colRight;
        currLum = lumRight;
      }
      if (lumUp > currLum) {
        colOut = colUp;
        currLum = lumUp;
      }
      if (lumDown > currLum) {
        colOut = colDown;
        currLum = lumDown;
      }
      out[currIdx++] = colOut;
    }
  }
  setPixels(pixels, out);
};

/**
 * Sets each pixel to its inverse value. No parameter is used.
 * @param  {Canvas} canvas
 */
function invertColors(pixels) {
  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i] = pixels[i] ^ 255; // Invert Red
    pixels[i + 1] = pixels[i + 1] ^ 255; // Invert Green
    pixels[i + 2] = pixels[i + 2] ^ 255; // Invert Blue
  }
}

export default preprocessImage;