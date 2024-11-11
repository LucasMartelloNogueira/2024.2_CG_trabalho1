
import vertShaderSrc from './simple.vert.js';
import fragShaderSrc from './simple.frag.js';

import Shader from './shader.js';

class Scene {
  constructor(gl) {
    this.data = [];

    this.delta = 0;
    this.mat = mat4.create();
    this.matLoc = -1;

    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    this.vaoLoc = -1;

    this.init(gl);
  }

  init(gl) {
    this.createShaderProgram(gl);
    this.createVAO(gl);
    this.createUniforms(gl);
  }

  createShaderProgram(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.matLoc = gl.getUniformLocation(this.program, "u_mat");
  }

  loadModel() {
    this.data = [
      // posição (x,y)
      0.10, 0.80,
      0.10, 0.90,
      0.25, 0.80,
      0.25, 0.80,
      0.40, 0.90,
      0.40, 0.80,
      0.10, 0.50,
      0.40, 0.80,
      0.10, 0.80,
      0.10, 0.50,
      0.40, 0.50,
      0.40, 0.80,
      0.40, 0.10,
      0.80, 0.50,
      0.40, 0.50,
      0.40, 0.10,
      0.80, 0.10,
      0.80, 0.50,
      0.80, 0.10,
      0.90, 0.10,
      0.80, 0.30,
      // Cor (rgb)
      1.0, 0.0, 0.0, 
      1.0, 0.0, 0.0, 
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      0.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      1.0, 0.0, 1.0,
      0.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
      0.0, 1.0, 1.0,
    ];
  }

  createVAO(gl) {
    this.loadModel();

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");

    // Criação do VBO (Shader.createBuffer)
    const dataBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.data));

    // Criação do VAO
    // Q1) Escreva a implementação da função abaixo, que constroi um VAO contendo informações de posicão e
    // cores, e esteja de acordo com a estrutura do array "this.data"
    this.vaoLoc = Shader.createVAO(gl, coordsAttributeLocation, colorsAttributeLocation, dataBuffer);
  }

  objectTransformation() {
    // Q2) Escreva matrizes de transformação que façam a coleção de triângulos dada em "this.data".
    // a) Estar centrada na posição (0,0).
    // b) Ter largura e altura igual a 1.8.
  }

  draw(gl) {  
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vaoLoc);

    this.objectTransformation();
    gl.uniformMatrix4fv(this.matLoc, false, this.mat);

    // Q3) Implemente o comando dl.drawArrays adequado para o programa em questão
  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");
    this.gl = canvas.getContext("webgl2");

    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.scene = new Scene(this.gl);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}
