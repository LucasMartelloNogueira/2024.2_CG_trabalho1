export default class Shader {
  static createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      var info = gl.getShaderInfoLog(shader);
      console.log('Could not compile WebGL program:' + info);
    }

    return shader;
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      var info = gl.getProgramInfoLog(program);
      console.log('Could not compile WebGL program:' + info);
    }

    return program;
  }

  static isArrayBuffer(value) {
    return value && value.buffer instanceof ArrayBuffer && value.byteLength !== undefined;
  }

  static createBuffer(gl, type, data) {
    if (data.length == 0)
      return null;

    if (!Shader.isArrayBuffer(data)) {
      console.warn('Data is not an instance of ArrayBuffer');
      return null;
    }

    var buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, gl.STATIC_DRAW);

    return buffer;
  }

  static createVAO(gl, posAttribLoc, colorAttribLoc, coordsBuffer, colorsBuffer) {
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    if (posAttribLoc != null) {
        gl.enableVertexAttribArray(posAttribLoc);
        let coord_size = 2
        let type = gl.FLOAT
        gl.bindBuffer(gl.ARRAY_BUFFER, coordsBuffer);
        gl.vertexAttribPointer(posAttribLoc, coord_size, type, false, 0, 0);
    }

    if (colorAttribLoc != null) {
        gl.enableVertexAttribArray(colorAttribLoc);
        let color_size = 3
        let type = gl.FLOAT
        gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);
        gl.vertexAttribPointer(colorAttribLoc, color_size, type, false, 0, 0);
    }

    return vao;
  }

}