uniform sampler2D t_audio;
uniform sampler2D t_matcap;
uniform sampler2D t_normal;
uniform samplerCube t_cubemap;


varying vec3 vNorm;
varying vec2 vUv;
varying vec3 vMPos;
varying vec3 vEye;
varying vec3 vPos;

uniform float slider1;
uniform float slider2;
uniform float slider3;
uniform float slider4;
uniform float slider5;
uniform float slider6;
uniform float slider7;

$uvNormalMap
$semLookup
$simplex


void main(){

	vec3 fNorm =uvNormalMap( t_normal , vPos , vUv  , vNorm , 1.5 + slider4, 0. + slider5 *.3);


vec3 refl = reflect(vEye , fNorm); 

  vec2 semLU = semLookup( normalize( vEye ) , fNorm );
  vec4 sem = texture2D( t_matcap , semLU );  


  vec4 cube = textureCube(t_cubemap, refl );

  
 

  float cutoff = (.06+.03 * slider6 )*length(vMPos.xz);

  cutoff = smoothstep( 0.6 , 1.,cutoff);

  vec3 fCol = cube.xyz;


float match = -dot(normalize(vEye), fNorm );

  vec4 aCol = texture2D( t_audio , vec2(match * .3  + .9* slider7,0.) );
  fCol.xyz *= 1.+dot(normalize(vEye), fNorm );
  fCol.xyz *=2.* aCol.xyz ;


  vec3 col = mix(fCol,vec3(0.,0.,0.), cutoff);
  col *=  (vec3(.8 + slider1 * .2 ,.7 + slider2 * .2,.4 + slider3 * .3) * .5 + .4);
  col *= .5;
 //col = aCol.xyz;
  // vec4 audio = texture2D( t_audio , vec2( lamb , 0. ));

 float row =clamp( abs(length( vMPos.xz)-5.) * 50., 0.,100.)/100.;

 float angle = (atan( vMPos.x , vMPos.z ) + 3.14)/6.28;

/*
 angle *= 7.;
 angle = mod(angle+.5,1.);
 angle -= .5;
 angle = .5-abs(angle);

 row *= (1.-angle * 2.);

 row += row*(1.+snoise( vMPos ));
  col *= row;//max(angle , row);*/
 /* col *= max(angle , row);
  col *= max(angle , row);*/
  col = fNorm * .5 + .5;

  gl_FragColor = vec4( col , 1. );


}
