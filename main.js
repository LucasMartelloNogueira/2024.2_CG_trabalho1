
import vertShaderSrc from './simple.vert.js';
import fragShaderSrc from './simple.frag.js';

import Shader from './shader.js';

class Scene {
  constructor(gl) {
    this.data = [];
    this.coords = []
    this.colors = []

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

    this.coords = this.data.slice(0, 43)
    this.colors = this.data.slice(43)
  }

  createVAO(gl) {
    this.loadModel();

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");

    // Criação do VBO (Shader.createBuffer)
    const dataBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.data));
    const coordBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.coords));
    const colorBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.colors));

    // Criação do VAO
    // Q1) Escreva a implementação da função abaixo, que constroi um VAO contendo informações de posicão e
    // cores, e esteja de acordo com a estrutura do array "this.data"
    this.vaoLoc = Shader.createVAO(gl, coordsAttributeLocation, colorsAttributeLocation, coordBuffer, colorBuffer);
  }

  objectTransformation() {
    // Q2) Escreva matrizes de transformação que façam a coleção de triângulos dada em "this.data".
    // a) Estar centrada na posição (0,0).
    // b) Ter largura e altura igual a 1.8.

    // Matriz identidade inicial
    mat4.identity(this.mat);

    // Aplicar escala uniforme de 1.8
    mat4.scale(this.mat, this.mat, [1.8, 1.8, 1.0]);

    // Para centralizar, podemos aplicar uma translação
    // Considerando que os vértices estão definidos entre (0.1, 0.1) e (0.9, 0.9), o centro seria aproximadamente (0.5, 0.5).
    // Movemos para (-0.5, -0.5) para centrar na origem
    mat4.translate(this.mat, this.mat, [-0.5, -0.5, 0.0]);
  }

  draw(gl) {  
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vaoLoc);

    this.objectTransformation();
    gl.uniformMatrix4fv(this.matLoc, false, this.mat);

    // Q3) Implemente o comando dl.drawArrays adequado para o programa em questão
  
    // Desenha a coleção de triângulos na tela usando o modo gl.TRIANGLES
    gl.drawArrays(gl.TRIANGLES, 0, 21); // Começando no índice 0 e desenhando 21 vértices
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
