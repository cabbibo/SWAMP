uniform sampler2D t_audio;
uniform float time;
uniform float id;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vPos;
varying vec3 vMPos;
varying vec3 vEye;
varying float vNoise;


$simplex


void main(){

  vNorm = normal;//( modelMatrix * vec4( normal , 0. )).xyz;
  vUv   = uv;

  float size = 4. * (sin( id * 100. )+2.)/2.;
  float speed = 1. * (sin( id * 12310. )+2.)/2.;
  float outVal = .1 * (sin( id * 300. )+2.)/2.;

  vNoise = (snoise(position * 4. + time)+1.)/2.;
  vPos  =  normal * (snoise(position * size + time*speed)+1.) * outVal;
  vMPos  = ( modelMatrix * vec4( vPos , 1.  )).xyz;


  vEye = vMPos - cameraPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos, 1. );

}