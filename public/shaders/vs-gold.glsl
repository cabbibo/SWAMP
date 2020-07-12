uniform sampler2D t_audio;
uniform float time;


uniform float slider1;
uniform float slider2;
uniform float slider3;
uniform float slider4;
uniform float slider5;
uniform float slider6;
uniform float slider7;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vEye;

$simplex


vec3 map( vec3 pos ){


  float r = length( pos.xy );
  return vec3(pos.x , pos.y , 0.) +   vec3(0.,0.,slider2 * .4+ .4) * (snoise(pos.xyz * .2 * (.5 +slider1*.5) + vec3(0.,0.,time * .3 * slider7))+length(pos.xy) * length( pos.xy ) * .03 * (slider3-.5) + .8*slider5*sin(time * slider6 + slider4 *4.*length( pos.xy)) / (.4 + length( pos.xy)));

}

vec3 nor( vec3 pos ){
  return normalize(cross( 
                   map(pos-vec3(.01,0.,0.)) - map(pos+vec3(.01,0.,0.)),
                   map(pos-vec3(.0,.01,0.)) - map(pos+vec3(.0,.01,0.))
                ));
}

void main(){

  vNorm = (modelMatrix * vec4(  nor( position ) , 0. )).xyz;
  vUv   = uv;
  vPos  = position;
  
  //vPos = map( position );
  

  vMPos  = ( modelMatrix * vec4( vPos , 1.  )).xyz;

  vEye = vMPos - cameraPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos, 1. );

}