// Q4) Escreva o shader de vértices adequado ao programa

export default 
`#version 300 es
precision highp float;

in vec2 position;
in vec3 color;

out vec3 vColor;

void main()
{
    gl_Position = vec4(position, 1.0, 1.0);
    vColor = color;
}`;
