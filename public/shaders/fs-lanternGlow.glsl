uniform sampler2D t_audio;
uniform sampler2D t_matcap;

uniform vec3 c_primaryColor;
uniform vec3 c_secondaryColor;


varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vEye;
varying vec3 vPos;




void main(){

	

vec3 col = vec3(pow(1.-vUv.y,2.));
col *= vec3(1.,.6,.2);
  gl_FragColor = vec4( col , 1. );


}
