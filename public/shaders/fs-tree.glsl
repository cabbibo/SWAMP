uniform sampler2D t_audio;
uniform sampler2D t_matcap;

varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vEye;
varying vec3 vPos;
varying float vNoise;
varying float vOffset;



$uvNormalMap
$semLookup

void main(){

	vec3 fNorm = vNorm; //uvNormalMap( t_normal , vPos , vUv  , vNorm , 4.1 , 1.1 );


  vec2 semLU = semLookup( normalize( vEye ) , fNorm );
  vec4 sem = texture2D( t_matcap , semLU );  
  vec4 aCol = texture2D( t_audio , vec2(mod(vNoise ,1.),0.) );


  
  vec3 col = mix( sem.xyz,vec3(0.,0.,0.), min(1.,.1*length(vEye)));
 col = aCol.xyz;
  col *= col;
  col *= vOffset * vOffset * 20.;
  // vec4 audio = texture2D( t_audio , vec2( lamb , 0. ));
  gl_FragColor = vec4( col , 1. );


}
