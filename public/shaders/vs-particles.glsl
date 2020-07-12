


attribute float id;


uniform float slider1;
uniform float slider2;
uniform float slider3;
uniform float slider4;
uniform float slider5;
uniform float slider6;
uniform float slider7;

uniform float time;

uniform sampler2D t_audio;
varying vec3 vColor;
varying float vID;
void main() {

	vColor = color;
	vID = id;


vec3 col = texture2D(t_audio,vec2(sin(vID), 0.)).xyz;




	vec3 fPos = position;


	fPos.xz *= 30. + slider2 * 30.;
	fPos.y *= 5. + slider3 * 10.;


	fPos.x += sin(time * (.2+slider4)*.4 * 1.53 * (sin(vID+ 3.) + 2.) +   vID) * 	(.2+slider5)* .1; 
	fPos.y += sin(time * (.2+slider4)*.4 * 1.7 * (sin(vID+20.) + 2.) + .5 + vID) * 	(.2+slider5)* .1; 
	fPos.z += sin(time * (.2+slider4)*.4 * 1.13 * (sin(vID+200.) + 2.)  + vID) * 	(.2+slider5) * .1; 
	
	fPos += vec3( 0., 20. , 0.);
	fPos -= vec3(0.,10.,0.) * slider3;

	vec4 mvPosition = modelViewMatrix * vec4( fPos, 1.0 );

	gl_PointSize = length(col) * ( .3 + slider6 * .7) * 100.1 / length( mvPosition.xyz );

	gl_Position = projectionMatrix * mvPosition;

}
